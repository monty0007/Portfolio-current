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
        console.log("Adding 'is_draft' and 'scheduled_date' columns to posts table...");

        await db.execute(`
            ALTER TABLE posts ADD COLUMN is_draft INTEGER DEFAULT 0;
        `);
        console.log("✅ 'is_draft' column added successfully.");
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log("ℹ️ Column 'is_draft' already exists. No migration needed.");
        } else {
            console.error("❌ Migration failed for 'is_draft':", err);
        }
    }

    try {
        await db.execute(`
            ALTER TABLE posts ADD COLUMN scheduled_date TEXT;
        `);
        console.log("✅ 'scheduled_date' column added successfully.");
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log("ℹ️ Column 'scheduled_date' already exists. No migration needed.");
        } else {
            console.error("❌ Migration failed for 'scheduled_date':", err);
        }
    }
}

migrate();
