import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

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

const posts = [
  {
    id: 'guide',
    title: 'Action Bastion Guide to Blogging',
    date: 'Jan 20, 2025',
    excerpt: 'Learn how to use Images, Code, and Notes in your custom blog entries!',
    category: 'Documentation',
    color: '#FFD600',
    content: '', // Fallback or empty if using sections primarily
    sections: JSON.stringify([
      { type: 'text', content: 'Welcome to your rich-content editor! Below are examples of everything you can build using the JSON sections in the admin panel.' },
      { type: 'note', content: 'Pro-Tip: You can find the JSON templates for these blocks by clicking "VIEW BLUEPRINT MANUAL" in the Admin Lab!' },
      { type: 'image', content: '', caption: 'High-tech gadgets for your blog posts.' },
      { type: 'text', content: 'You can also drop code snippets that look like real 22nd-century terminals:' },
      { type: 'code', content: 'const powerUp = () => {\n  console.log("ACTION BASTION!!!");\n  return "🚀 Ready for deployment!";\n};', language: 'javascript' },
      { type: 'text', content: 'Every section is framed with neubrutalist borders to keep that premium Awwwards cartoon aesthetic.' }
    ])
  },
  {
    id: '1',
    title: 'The Secret Life of LLMs',
    date: 'Oct 12, 2024',
    excerpt: 'Exploring how hidden states in transformers resemble 90s cartoon logic.',
    category: 'AI Research',
    color: '#FF4B4B',
    content: '',
    sections: JSON.stringify([
      { type: 'text', content: 'Transformers are essentially vast neural stages where attention mechanisms act as directors.' },
      { type: 'image', content: '', caption: 'Neural networks visualizing patterns.' },
      { type: 'note', content: 'Attention is all you need, but a good cape helps too!' }
    ])
  }
];

async function seed() {
  try {
    console.log("Dropping existing table 'posts'...");
    await db.execute("DROP TABLE IF EXISTS posts");

    console.log("Creating table 'posts'...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT,
        excerpt TEXT,
        content TEXT,
        author TEXT DEFAULT 'Manish Yadav',
        created_at TEXT,
        read_time TEXT,
        image_url TEXT,
        tags TEXT DEFAULT '[]',
        category TEXT,
        color TEXT,
        sections TEXT
      );
    `);
    console.log("Table created.");

    for (const post of posts) {
      console.log(`Inserting post: ${post.title}`);

      await db.execute({
        sql: `INSERT INTO posts (slug, title, created_at, excerpt, category, color, sections, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [post.id, post.title, post.date, post.excerpt, post.category, post.color, post.sections, post.content]
      });
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    // db.close(); // libsql client might not need explicit close for script exit, or is closed by process exit
  }
}

seed();
