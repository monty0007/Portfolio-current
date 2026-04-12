// Run with: node scripts/add-sort-order-column.cjs
// Adds a `sort_order` column to the projects table so ordering persists across all devices.

const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ VITE_TURSO_DATABASE_URL is missing in .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

async function migrate() {
  try {
    await db.execute(`ALTER TABLE projects ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0`);
    console.log("✅ Migration complete! 'sort_order' column added to projects table.");
    console.log("ℹ️  Tip: Open the Admin panel and move any project up/down once to sync the order to the database.");
  } catch (err) {
    if (err.message && err.message.includes('duplicate column name')) {
      console.log("ℹ️ Column 'sort_order' already exists. No migration needed.");
    } else {
      console.error('❌ Migration failed:', err.message);
    }
  }
}

migrate();
