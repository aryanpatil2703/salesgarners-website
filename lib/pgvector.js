import { Pool } from 'pg';
import crypto from 'crypto';
import './env.js';
import { logger } from './logger.js';

/**
 * Singleton PostgreSQL connection pool reference across hot reloads and worker invocations.
 * @type {Pool | null}
 */
let poolInstance = null;

/**
 * Resolves the active PostgreSQL connection URI from supported environment variables.
 * Prioritizes PG_CONNECTION_STRING, then POSTGRES_URL, then postgres DATABASE_URL.
 * @returns {string | null} Database connection string or null if unconfigured
 */
export function getPostgresConnectionString() {
  const uri = process.env.PG_CONNECTION_STRING || process.env.POSTGRES_URL;
  if (uri) return uri;

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
    return dbUrl;
  }

  // Docker default fallback when running inside container network or local docker-compose
  if (process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD) {
    const user = process.env.POSTGRES_USER;
    const pass = process.env.POSTGRES_PASSWORD;
    const host = process.env.POSTGRES_HOST || 'localhost';
    const port = process.env.POSTGRES_PORT || '5432';
    const db = process.env.POSTGRES_DB || 'salesgarners';
    return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
  }

  return null;
}

/**
 * Checks whether PostgreSQL connection parameters are available in the current runtime environment.
 * Allows client and server to switch seamlessly between pgvector and local semantic fallback.
 * @returns {boolean} True if a PostgreSQL connection URI exists
 */
export function isPgConfigured() {
  return Boolean(getPostgresConnectionString());
}

/**
 * Retrieves or instantiates the singleton PostgreSQL connection pool with connection safety limits.
 * Uses connection pooling to prevent socket exhaustion during concurrent chat interactions.
 * @returns {Pool} Active node-postgres Pool instance
 */
export function getPgPool() {
  if (poolInstance) return poolInstance;

  const connectionString = getPostgresConnectionString();
  if (!connectionString) {
    throw new Error('PostgreSQL connection string is not defined in environment variables (PG_CONNECTION_STRING).');
  }

  // Determine SSL requirement; cloud hosted databases (Neon, RDS, Supabase) mandate TLS, local Docker does not
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1') || connectionString.includes('pgvector');
  const ssl = isLocal ? false : { rejectUnauthorized: false };

  poolInstance = new Pool({
    connectionString,
    ssl,
    max: 20, // Max concurrent database connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 4000,
  });

  poolInstance.on('error', (err) => {
    logger.error('Unexpected error on idle PostgreSQL client in pool', { error: err.message });
  });

  return poolInstance;
}

/**
 * Validates connectivity to the PostgreSQL vector database and reports extension status.
 * Used during health check probes and system startup.
 * @returns {Promise<{ healthy: boolean, version?: string, hasVectorExtension: boolean, error?: string }>}
 */
export async function checkPgVectorHealth() {
  if (!isPgConfigured()) {
    return { healthy: false, hasVectorExtension: false, error: 'Database unconfigured (PG_CONNECTION_STRING missing)' };
  }

  let client;
  try {
    const pool = getPgPool();
    client = await pool.connect();

    const versionRes = await client.query('SELECT version();');
    const extRes = await client.query("SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';");

    const hasVectorExtension = extRes.rows.length > 0;
    return {
      healthy: true,
      version: versionRes.rows[0]?.version?.split(' ')?.[1] || 'unknown',
      hasVectorExtension,
    };
  } catch (err) {
    return {
      healthy: false,
      hasVectorExtension: false,
      error: err.message,
    };
  } finally {
    if (client) client.release();
  }
}

/**
 * Initializes the pgvector extension and document schema in the target database.
 * Executes idempotently to prevent errors when tables and vector indexes already exist.
 * @param {number} [dimensions=1536] - Embedding vector dimensionality
 * @returns {Promise<void>}
 */
export async function initPgVector(dimensions = 1536) {
  const pool = getPgPool();
  const client = await pool.connect();

  try {
    // Enable the vector extension if not present
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');

    // Create knowledge chunk table with vector column and unique chunk constraint
    await client.query(`
      CREATE TABLE IF NOT EXISTS salesgarners_documents (
        id BIGSERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        category VARCHAR(64) NOT NULL DEFAULT 'general',
        chunk_index INT NOT NULL DEFAULT 0,
        content TEXT NOT NULL,
        content_hash VARCHAR(64) NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        embedding vector(${dimensions}),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_salesgarners_chunk UNIQUE (url, chunk_index)
      );
    `);

    // Create HNSW index for high performance approximate nearest neighbor cosine search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_salesgarners_docs_hnsw
        ON salesgarners_documents
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64);
    `);

    // Create auxiliary lookup indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_salesgarners_docs_category ON salesgarners_documents (category);
      CREATE INDEX IF NOT EXISTS idx_salesgarners_docs_url ON salesgarners_documents (url);
    `);

    logger.info('pgvector database extension and production schema verified', { dimensions });
  } catch (err) {
    logger.error('Failed to initialize pgvector database schema', { error: err.message });
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Inserts or updates a document knowledge chunk along with its vector embedding using ON CONFLICT upsert.
 * Ensures data idempotency and eliminates redundant duplicate records during repeated ingestion.
 * @param {object} params - Document chunk payload
 * @param {string} params.url - Source page URL
 * @param {string} params.title - Document or section title
 * @param {string} [params.category='general'] - Section category
 * @param {number} [params.chunkIndex=0] - Numerical index of the chunk within the document
 * @param {string} params.content - Text content of the chunk
 * @param {Record<string, unknown>} [params.metadata={}] - Structured metadata
 * @param {number[]} params.embedding - Array of float values representing the embedding
 * @returns {Promise<number>} Inserted/Updated row ID
 */
export async function storeDocumentChunk({
  url,
  title,
  category = 'general',
  chunkIndex = 0,
  content,
  metadata = {},
  embedding,
}) {
  const pool = getPgPool();
  const vectorString = `[${embedding.join(',')}]`;
  const contentHash = crypto.createHash('sha256').update(`${url}:${chunkIndex}:${content}`).digest('hex');

  const query = `
    INSERT INTO salesgarners_documents (url, title, category, chunk_index, content, content_hash, metadata, embedding, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector, NOW())
    ON CONFLICT (url, chunk_index) DO UPDATE
    SET
      title = EXCLUDED.title,
      category = EXCLUDED.category,
      content = EXCLUDED.content,
      content_hash = EXCLUDED.content_hash,
      metadata = EXCLUDED.metadata,
      embedding = EXCLUDED.embedding,
      updated_at = NOW()
    RETURNING id;
  `;

  const values = [url, title, category, chunkIndex, content, contentHash, JSON.stringify(metadata), vectorString];
  const result = await pool.query(query, values);
  return result.rows[0].id;
}

/**
 * Searches for top-k document chunks closest in cosine space to the query embedding vector.
 * Utilizes the pgvector `<=>` cosine distance operator with index acceleration.
 * @param {object} params - Search configuration
 * @param {number[]} params.embedding - Query embedding vector
 * @param {number} [params.limit=4] - Max number of relevant chunks to return
 * @param {number} [params.minSimilarity=0.25] - Minimum cosine similarity threshold (0.0 - 1.0)
 * @returns {Promise<Array<{ id: number, url: string, title: string, category: string, content: string, metadata: object, similarity: number }>>}
 */
export async function searchSimilarDocuments({
  embedding,
  limit = 4,
  minSimilarity = 0.25,
}) {
  const pool = getPgPool();
  const vectorString = `[${embedding.join(',')}]`;

  // Use cosine distance operator <=> where similarity = 1 - distance
  const query = `
    SELECT
      id,
      url,
      title,
      category,
      chunk_index,
      content,
      metadata,
      1 - (embedding <=> $1::vector) AS similarity
    FROM salesgarners_documents
    WHERE embedding IS NOT NULL
      AND 1 - (embedding <=> $1::vector) >= $3
    ORDER BY embedding <=> $1::vector ASC
    LIMIT $2;
  `;

  const result = await pool.query(query, [vectorString, limit, minSimilarity]);

  return result.rows.map((row) => ({
    ...row,
    similarity: Number(row.similarity),
  }));
}

/**
 * Clears existing document knowledge chunks to enable idempotent fresh re-indexing.
 * @returns {Promise<number>} Count of deleted chunks
 */
export async function clearDocuments() {
  const pool = getPgPool();
  const result = await pool.query('DELETE FROM salesgarners_documents;');
  logger.info('Cleared salesgarners_documents table for fresh ingestion', { count: result.rowCount });
  return result.rowCount;
}
