// Run with: node scripts/create-projects-table.cjs
// This creates the `projects` table in your Turso database.

const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ VITE_TURSO_DATABASE_URL is missing in .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

async function run() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT    NOT NULL,
        description TEXT    NOT NULL DEFAULT '',
        image_url   TEXT    NOT NULL DEFAULT '',
        tags        TEXT    NOT NULL DEFAULT '[]',
        color       TEXT    NOT NULL DEFAULT '#FFD600',
        live_link   TEXT    NOT NULL DEFAULT '',
        github_link TEXT    NOT NULL DEFAULT '',
        disabled    INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('✅ projects table created (or already exists)');
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

run();
