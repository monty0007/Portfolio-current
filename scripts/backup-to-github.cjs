// Backup script: fetches blogs / badges / projects from Turso DB and
// commits them as JSON files to a separate backup GitHub repo.
//
// Required env vars:
//   VITE_TURSO_DATABASE_URL   (Turso libsql URL)
//   VITE_TURSO_AUTH_TOKEN     (Turso auth token)
//   BACKUP_GH_TOKEN           (GitHub PAT with `contents: write` on backup repo)
//   BACKUP_REPO               (e.g. "meownty/portfolio-backups")
//   BACKUP_BRANCH             (optional, default "main")
//
// Run locally:  node scripts/backup-to-github.cjs

const { createClient } = require('@libsql/client');
require('dotenv').config();

const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN;
const GH_TOKEN = process.env.BACKUP_GH_TOKEN;
const REPO = process.env.BACKUP_REPO;
const BRANCH = process.env.BACKUP_BRANCH || 'main';

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

if (!TURSO_URL) fail('VITE_TURSO_DATABASE_URL is missing');
if (!GH_TOKEN) fail('BACKUP_GH_TOKEN is missing');
if (!REPO || !REPO.includes('/')) fail('BACKUP_REPO must be set as "owner/repo"');

const db = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
const GH_API = 'https://api.github.com';
const headers = {
  Authorization: `Bearer ${GH_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'portfolio-backup-script',
};

// Encode UTF-8 string as base64
const toB64 = (s) => Buffer.from(s, 'utf8').toString('base64');

// Fetch existing file SHA (needed for updates). Returns null if file does not exist.
async function getFileSha(path) {
  const res = await fetch(
    `${GH_API}/repos/${REPO}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(BRANCH)}`,
    { headers }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.sha;
}

// Create or update a file in the backup repo. Skips network write if content unchanged.
async function putFile(path, content, message) {
  const sha = await getFileSha(path);

  // If the file exists, compare its content via a separate fetch to avoid useless commits.
  // The contents API in GET above only returns metadata when file is large; we'll just compare via a HEAD-content fetch:
  if (sha) {
    const existingRes = await fetch(
      `${GH_API}/repos/${REPO}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(BRANCH)}`,
      { headers }
    );
    if (existingRes.ok) {
      const existing = await existingRes.json();
      if (existing.content) {
        const existingDecoded = Buffer.from(existing.content, 'base64').toString('utf8');
        if (existingDecoded === content) {
          return { skipped: true };
        }
      }
    }
  }

  const body = {
    message,
    content: toB64(content),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GH_API}/repos/${REPO}/contents/${encodeURIComponent(path)}`,
    { method: 'PUT', headers, body: JSON.stringify(body) }
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PUT ${path} failed: ${res.status} ${txt}`);
  }
  return { skipped: false };
}

function safeFilename(s) {
  return String(s).replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'item';
}

function parseJsonField(v) {
  if (!v) return null;
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return v; }
  }
  return v;
}

async function fetchAll() {
  const [posts, projects, achievements] = await Promise.all([
    db.execute('SELECT * FROM posts ORDER BY id ASC'),
    db.execute('SELECT * FROM projects ORDER BY sort_order ASC, id ASC'),
    db.execute('SELECT * FROM achievements ORDER BY ordering ASC, id ASC'),
  ]);

  const blogs = posts.rows.map((r) => ({
    id: Number(r.id),
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    author: r.author,
    created_at: r.created_at,
    read_time: r.read_time,
    image_url: r.image_url,
    tags: parseJsonField(r.tags),
    category: r.category,
    color: r.color,
    sections: parseJsonField(r.sections),
    live_link: r.live_link,
    is_draft: !!r.is_draft,
    scheduled_date: r.scheduled_date,
  }));

  const projectsOut = projects.rows.map((r) => ({
    id: Number(r.id),
    title: r.title,
    description: r.description,
    image_url: r.image_url,
    tags: parseJsonField(r.tags),
    color: r.color,
    live_link: r.live_link,
    github_link: r.github_link,
    disabled: !!r.disabled,
    sort_order: Number(r.sort_order || 0),
  }));

  const badges = achievements.rows.map((r) => ({
    id: Number(r.id),
    title: r.title,
    location: r.location,
    image: r.image,
    linkedin: r.linkedin,
    rotation: r.rotation,
    ordering: r.ordering,
    award: r.award,
  }));

  return { blogs, projectsOut, badges };
}

(async () => {
  console.log(`📦 Backing up to ${REPO}@${BRANCH}`);
  const { blogs, projectsOut, badges } = await fetchAll();
  console.log(`  • ${blogs.length} blogs, ${projectsOut.length} projects, ${badges.length} badges`);

  const now = new Date().toISOString();
  const stats = { written: 0, skipped: 0, failed: 0 };

  const writeOne = async (path, obj) => {
    const content = JSON.stringify(obj, null, 2) + '\n';
    try {
      const { skipped } = await putFile(path, content, `chore(backup): update ${path}`);
      if (skipped) {
        stats.skipped++;
        process.stdout.write('·');
      } else {
        stats.written++;
        process.stdout.write('+');
      }
    } catch (err) {
      stats.failed++;
      console.error(`\n  ❌ ${path}: ${err.message}`);
    }
  };

  // Write per-item files so diffs are clean and human-readable
  for (const b of blogs) {
    const name = `${b.id}-${safeFilename(b.slug || b.title)}.json`;
    await writeOne(`blogs/${name}`, b);
  }
  for (const p of projectsOut) {
    const name = `${p.id}-${safeFilename(p.title)}.json`;
    await writeOne(`projects/${name}`, p);
  }
  for (const a of badges) {
    const name = `${a.id}-${safeFilename(a.title)}.json`;
    await writeOne(`badges/${name}`, a);
  }

  // Also write consolidated snapshots for easy restore
  await writeOne('snapshots/blogs.json', blogs);
  await writeOne('snapshots/projects.json', projectsOut);
  await writeOne('snapshots/badges.json', badges);

  // Manifest
  const manifest = {
    backed_up_at: now,
    counts: {
      blogs: blogs.length,
      projects: projectsOut.length,
      badges: badges.length,
    },
    source: 'Turso (libsql)',
  };
  await writeOne('manifest.json', manifest);

  console.log(`\n✅ Done — written: ${stats.written}, unchanged: ${stats.skipped}, failed: ${stats.failed}`);
  if (stats.failed > 0) process.exit(1);
})().catch((err) => {
  console.error('💥 Backup failed:', err);
  process.exit(1);
});
