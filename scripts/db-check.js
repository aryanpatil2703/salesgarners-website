/**
 * Diagnostic utility script to verify PostgreSQL and pgvector database health.
 * Can be run in CI/CD, Docker deployment health checks, or locally.
 */

import '../lib/env.js';
import { checkPgVectorHealth, getPostgresConnectionString, getPgPool } from '../lib/pgvector.js';

async function main() {
  console.log('🔍 Checking PostgreSQL & pgvector Status...');
  const connStr = getPostgresConnectionString();

  if (!connStr) {
    console.log('⚠️ No PostgreSQL connection string detected.');
    console.log('   Please set PG_CONNECTION_STRING in your environment or .env file.');
    console.log('   Example: PG_CONNECTION_STRING="postgresql://salesgarners_user:salesgarners_secure_password@localhost:5432/salesgarners"');
    console.log('   To start Docker pgvector, run: docker compose up -d');
    process.exit(0);
  }

  // Mask sensitive password before logging
  const maskedConn = connStr.replace(/:([^:@]+)@/, ':****@');
  console.log(`📡 Connecting to: ${maskedConn}`);

  const health = await checkPgVectorHealth();

  if (!health.healthy) {
    console.error('❌ Connection Failed:', health.error);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Make sure Docker is running: `docker compose up -d`');
    console.log('2. Check container logs: `docker compose logs pgvector`');
    console.log('3. Verify port 5432 is not occupied by another process.');
    process.exit(1);
  }

  console.log('✅ PostgreSQL is reachable!');
  console.log(`   Version: ${health.version}`);

  if (health.hasVectorExtension) {
    console.log('✅ pgvector extension is installed and active.');
  } else {
    console.warn('⚠️ pgvector extension is NOT installed. Run `npm run ingest` to initialize.');
  }

  // Check document row count
  try {
    const pool = getPgPool();
    const res = await pool.query('SELECT COUNT(*)::int AS count FROM salesgarners_documents;');
    console.log(`📊 Total Document Chunks in Database: ${res.rows[0].count}`);
  } catch (err) {
    console.log('ℹ️ Table salesgarners_documents not yet created. Run `npm run ingest` to initialize and populate.');
  }

  console.log('🎉 Database health check complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error during database check:', err);
  process.exit(1);
});

