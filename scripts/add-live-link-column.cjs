const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
    console.error("Error: VITE_TURSO_DATABASE_URL is not set in .env");
    process.exit(1);
}

const db = createClient({
    url,
    authToken,
});

async function migrate() {
    try {
        console.log("Adding 'live_link' column to posts table...");

        await db.execute(`
      ALTER TABLE posts ADD COLUMN live_link TEXT DEFAULT '';
    `);

        console.log("✅ Migration complete! 'live_link' column added successfully.");
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log("ℹ️ Column 'live_link' already exists. No migration needed.");
        } else {
            console.error("❌ Migration failed:", err);
        }
    }
}

migrate();
