-- SalesGarners pgvector Production Schema
-- Designed for Docker PostgreSQL (pgvector/pgvector:pg16)
-- Provides sub-millisecond semantic search, idempotent migrations, and upsert capabilities.

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Ensure updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_salesgarners_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Documents and knowledge chunks table
CREATE TABLE IF NOT EXISTS salesgarners_documents (
  id            BIGSERIAL PRIMARY KEY,
  url           TEXT NOT NULL,
  title         TEXT NOT NULL,
  category      VARCHAR(64) NOT NULL DEFAULT 'general',
  chunk_index   INT NOT NULL DEFAULT 0,
  content       TEXT NOT NULL,
  content_hash  VARCHAR(64) NOT NULL,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  embedding     vector(1536), -- 1536 dimensions for OpenAI text-embedding-3-small or Gemini
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_salesgarners_chunk UNIQUE (url, chunk_index)
);

-- Cosine distance HNSW index for sub-millisecond approximate nearest neighbor (ANN) retrieval
CREATE INDEX IF NOT EXISTS idx_salesgarners_docs_hnsw
  ON salesgarners_documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Auxiliary indexes for filtering and upsert lookups
CREATE INDEX IF NOT EXISTS idx_salesgarners_docs_category ON salesgarners_documents (category);
CREATE INDEX IF NOT EXISTS idx_salesgarners_docs_url ON salesgarners_documents (url);
CREATE INDEX IF NOT EXISTS idx_salesgarners_docs_hash ON salesgarners_documents (content_hash);

-- Auto-update timestamp trigger
DROP TRIGGER IF EXISTS trg_salesgarners_docs_updated ON salesgarners_documents;
CREATE TRIGGER trg_salesgarners_docs_updated
  BEFORE UPDATE ON salesgarners_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_salesgarners_timestamp();

-- Stored procedure for vector cosine matching
CREATE OR REPLACE FUNCTION match_salesgarners_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.25,
  match_count int DEFAULT 4
)
RETURNS TABLE (
  id bigint,
  url text,
  title text,
  category varchar(64),
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    salesgarners_documents.id,
    salesgarners_documents.url,
    salesgarners_documents.title,
    salesgarners_documents.category,
    salesgarners_documents.content,
    salesgarners_documents.metadata,
    1 - (salesgarners_documents.embedding <=> query_embedding) AS similarity
  FROM salesgarners_documents
  WHERE salesgarners_documents.embedding IS NOT NULL
    AND 1 - (salesgarners_documents.embedding <=> query_embedding) >= match_threshold
  ORDER BY salesgarners_documents.embedding <=> query_embedding ASC
  LIMIT match_count;
$$;
