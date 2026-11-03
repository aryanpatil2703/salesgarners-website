import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import { isPgConfigured, searchSimilarDocuments } from './pgvector.js';

let cachedKnowledgeBase = null;

/**
 * In-memory LRU cache for query embeddings to avoid redundant upstream API round-trips.
 */
const embeddingCache = new Map();
const MAX_EMBEDDING_CACHE = 500;

/**
 * Loads knowledge base documents safely across both Node script runs and Next.js webpack runtimes.
 * @returns {Array<object>}
 */
function getKnowledgeBaseDocs() {
  if (cachedKnowledgeBase) return cachedKnowledgeBase;
  try {
    const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
    const kbPath = path.join(currentDir, '..', 'data', 'knowledge-base.json');
    if (fs.existsSync(kbPath)) {
      const raw = fs.readFileSync(kbPath, 'utf-8');
      cachedKnowledgeBase = JSON.parse(raw);
      return cachedKnowledgeBase;
    }
  } catch (err) {
    logger.warn('Could not read static knowledge base file directly from disk', { error: err.message });
  }
  return [];
}

/**
 * Helper to cache and return embedding vector.
 * @param {string} key
 * @param {number[]} vec
 * @returns {number[]}
 */
function setCachedEmbedding(key, vec) {
  if (embeddingCache.size >= MAX_EMBEDDING_CACHE) {
    const oldest = embeddingCache.keys().next().value;
    embeddingCache.delete(oldest);
  }
  embeddingCache.set(key, vec);
  return vec;
}

/**
 * Generates an embedding vector for given input text using the configured LLM provider.
 * Fallbacks to deterministic pseudo-semantic vector representation if API keys are unconfigured.
 * Utilizes memory LRU caching for instantaneous 0ms sub-sequent retrievals.
 * @param {string} text - Input text to embed
 * @returns {Promise<number[]>} 1536-dimensional normalized vector
 */
export async function generateEmbedding(text) {
  const cleanText = text.replace(/\n+/g, ' ').trim();
  if (!cleanText) {
    return new Array(1536).fill(0);
  }

  // 0. Check in-memory cache
  if (embeddingCache.has(cleanText)) {
    return embeddingCache.get(cleanText);
  }

  // 1. Check for OpenAI API key
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: cleanText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return setCachedEmbedding(cleanText, data.data[0].embedding);
      }
      logger.warn('OpenAI embedding call returned non-200 status', { status: res.status });
    } catch (err) {
      logger.error('Failed to generate embedding via OpenAI', { error: err.message });
    }
  }

  // 2. Check for Google Gemini API key
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text: cleanText }] },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const values = data.embedding?.values || [];
        // Pad or slice to 1536 if necessary for uniform vector(1536) schema
        if (values.length === 1536) return setCachedEmbedding(cleanText, values);
        if (values.length > 0) {
          const padded = new Array(1536).fill(0);
          for (let i = 0; i < values.length; i++) padded[i] = values[i];
          return setCachedEmbedding(cleanText, padded);
        }
      }
      logger.warn('Gemini embedding call returned non-200 status', { status: res.status });
    } catch (err) {
      logger.error('Failed to generate embedding via Gemini', { error: err.message });
    }
  }

  // 3. Fallback: Deterministic normalized hash-based embedding for local testing without external keys
  return setCachedEmbedding(cleanText, createDeterministicEmbedding(cleanText, 1536));
}

/**
 * Creates a deterministic, unit-normalized vector for testing environments where external embedding APIs are not active.
 * Employs rolling hash projection to preserve basic token distinction without network dependencies.
 * @param {string} text - Text string
 * @param {number} dims - Target dimensionality
 * @returns {number[]} Unit-normalized float vector
 */
function createDeterministicEmbedding(text, dims = 1536) {
  const vector = new Array(dims).fill(0);
  const words = text.toLowerCase().match(/[a-z0-9_-]+/g) || ['empty'];

  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dims;
    const sign = hash % 2 === 0 ? 1 : -1;
    vector[idx] += sign * (1 / (w + 1));
  }

  // Calculate L2 norm for cosine normalization
  let sumSq = 0;
  for (let i = 0; i < dims; i++) sumSq += vector[i] * vector[i];
  const magnitude = Math.sqrt(sumSq) || 1;

  for (let i = 0; i < dims; i++) {
    vector[i] = Number((vector[i] / magnitude).toFixed(6));
  }

  return vector;
}

/**
 * Performs fast lexical & token overlap scoring on the indexed knowledge base.
 * Acts as an instantaneous fallback whenever PostgreSQL / pgvector is unconfigured or unreachable.
 * @param {string} query - Raw user search query
 * @param {number} [limit=4] - Max relevant entries to retrieve
 * @returns {Array<{ id: number, url: string, title: string, category: string, content: string, similarity: number }>}
 */
function searchLocalKnowledgeBase(query, limit = 4) {
  const docs = getKnowledgeBaseDocs();
  if (!Array.isArray(docs) || docs.length === 0) {
    return [];
  }

  const queryTokens = (query.toLowerCase().match(/[a-z0-9]{3,}/g) || []);
  if (queryTokens.length === 0) {
    return docs.slice(0, limit).map((doc, idx) => ({
      id: idx + 1,
      url: doc.url,
      title: doc.title,
      category: doc.category || 'general',
      content: doc.content,
      similarity: 0.5,
    }));
  }

  const scored = docs.map((doc, idx) => {
    const textToMatch = `${doc.title} ${doc.category} ${doc.content}`.toLowerCase();
    let score = 0;

    for (const token of queryTokens) {
      if (textToMatch.includes(token)) {
        // Higher weighting for title and category matches
        if (doc.title.toLowerCase().includes(token)) score += 3;
        if ((doc.category || '').toLowerCase().includes(token)) score += 2;
        score += 1;
      }
    }

    return {
      id: idx + 1,
      url: doc.url,
      title: doc.title,
      category: doc.category || 'general',
      content: doc.content,
      similarity: Math.min(1.0, score / (queryTokens.length * 3 + 1)),
    };
  });

  return scored
    .filter((item) => item.similarity > 0.05)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * High-level knowledge retrieval router.
 * Routes to pgvector when a PostgreSQL database is connected, and falls back to local knowledge search seamlessly.
 * @param {string} query - Visitor's natural language question
 * @param {number} [limit=4] - Number of top documents to fetch
 * @returns {Promise<Array<{ id: number, url: string, title: string, category: string, content: string, similarity: number, source: string }>>}
 */
export async function findRelevantKnowledge(query, limit = 4) {
  if (isPgConfigured()) {
    try {
      const embedding = await generateEmbedding(query);
      const docs = await searchSimilarDocuments({ embedding, limit, minSimilarity: 0.35 });
      if (docs && docs.length > 0) {
        return docs.map((d) => ({ ...d, source: 'pgvector' }));
      }
      logger.info('pgvector returned 0 matches, falling back to local knowledge base');
    } catch (err) {
      logger.warn('pgvector retrieval encountered an error, using local fallback', { error: err.message });
    }
  }

  const localResults = searchLocalKnowledgeBase(query, limit);
  return localResults.map((d) => ({ ...d, source: 'local_kb' }));
}
