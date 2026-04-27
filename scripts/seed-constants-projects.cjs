// One-time script: seeds all PROJECTS from constants into the DB.
// Run with: node scripts/seed-constants-projects.cjs

const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ VITE_TURSO_DATABASE_URL is missing in .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

const PROJECTS = [
  { title: 'Trivia Arena', description: 'An interactive quiz platform where users can create and play quizzes, featuring authentication and a joyful, user-focused UI/UX.', image: '/triviarena.png', tags: ['React', 'Firebase', 'MongoDB', 'TailwindCSS'], color: '#00A1FF', link: 'https://triviarena.maoverse.xyz/', githubLink: '', disabled: false },
  { title: 'Power Quote', description: 'A live Power Apps solution for managing quotations and purchase orders, with automated Word and PDF generation.', image: '/screen.png', tags: ['Power Apps', 'Power Automate', 'SharePoint / Dataverse', 'Word Templates'], color: '#FF4B4B', link: 'na', githubLink: '', disabled: true },
  { title: 'Automify The Builder', description: 'A drag-and-drop automation platform inspired by n8n, enabling users to visually design workflows through a clean interface.', image: '/auto.png', tags: ['React', 'Automation', 'Workflow Builder'], color: '#6B4BFF', link: 'https://automify.vercel.app/', githubLink: '', disabled: false },
  { title: 'Oryn', description: 'A prompt board that helps users craft precise, structured prompts to generate accurate AI images — no more guessing what to type.', image: '/oryn.png', tags: ['AI', 'Prompt Engineering', 'Image Generation', 'React'], color: '#FF6B35', link: 'https://oryn.maoverse.xyz/', githubLink: '', disabled: false },
  { title: 'Doc Reaper', description: 'A web tool that converts HTML to PDF on the fly — built because no reliable online solution existed for this seemingly simple need.', image: '/docreaper.png', tags: ['Node.js', 'HTML to PDF', 'Web Tool'], color: '#E91E63', link: 'https://docreaper.maoverse.xyz/', githubLink: '', disabled: false },
  { title: 'Mario Kart', description: 'Hackathon-winning game: an extended Mario experience where the player navigates through levels inside a kart, blending classic platformer mechanics with kart gameplay.', image: '/mariokart.png', tags: ['JavaScript', 'Canvas', 'Game Dev', 'Hackathon Winner'], color: '#E53935', link: 'https://super-mario-kart-902002915057.asia-south1.run.app/', githubLink: '', disabled: false },
  { title: 'Reportix', description: 'An intelligent document system built on the Microsoft Power Platform that automates the otherwise manual, time-consuming process of generating reports inside enterprise workflows.', image: '/reportix.png', tags: ['Power Platform', 'Power Automate', 'SharePoint', 'Automation'], color: '#1565C0', link: '', githubLink: '', disabled: true },
  { title: 'InspectIQ', description: 'Digitized a critical inspection report that was previously near-impossible to standardize, and built automation to proactively track and flag machines approaching their expiry dates.', image: '', tags: ['Power Apps', 'Power Automate', 'Digitization', 'Automation'], color: '#37474F', link: '', githubLink: '', disabled: true },
  { title: 'Azure Pricing Calculator', description: 'A smarter alternative to the official Azure pricing page — users can manually configure BOQs in a cleaner interface, or let AI generate them automatically. Supports saving quotes and side-by-side VM comparisons.', image: '/azurecalc.png', tags: ['React', 'Azure', 'AI', 'BOQ', 'VM Comparison'], color: '#0078D4', link: 'http://calcai.maoverse.xyz/', githubLink: '', disabled: false },
  { title: 'BizForge', description: 'An end-to-end business operations suite tailored for SMBs — covers the full cycle from quotation creation and approvals to accounts payable, payment processing, and Tally push integration. Includes RBAC, admin dashboards, and financial graphs.', image: '/foetronlab.png', tags: ['React', 'Finance', 'RBAC', 'Tally Integration', 'SMB', 'ERP'], color: '#2E7D32', link: '', githubLink: '', disabled: true },
  { title: 'Cookie Craze', description: 'A delightful, fully animated cookie-themed website with smooth transitions and playful UI interactions.', image: '/cookie.png', tags: ['HTML', 'CSS', 'Animation'], color: '#FF9800', link: '', githubLink: '', disabled: false },
  { title: 'Yojana AI', description: "Simply describe yourself and Yojana AI surfaces all government schemes you are eligible for — eliminating the need to manually browse through hundreds of scheme listings across portals.", image: '/yojana.png', tags: ['AI', 'React', 'Government Schemes', 'NLP'], color: '#6A1B9A', link: '', githubLink: '', disabled: false },
  { title: 'Promptboard', description: 'A sleek prompt board for AI image generation — same core idea as Oryn but rebuilt from scratch with a completely different UI/UX direction, exploring an alternate design language for the same problem.', image: '/promptboard.png', tags: ['AI', 'Prompt Engineering', 'Image Generation', 'React'], color: '#00BCD4', link: 'https://promptboard.zero1studio.xyz/', githubLink: '', disabled: false },
  { title: 'ReelTrace', description: 'Drop any Instagram reel link and ReelTrace pinpoints the exact filming location on a map — or generates a ready-to-use travel itinerary based on the spots featured in the reel.', image: '/reeltrace.png', tags: ['AI', 'React', 'Location Detection', 'Travel', 'Instagram'], color: '#F06292', link: 'https://itinerary-planner-liard.vercel.app/plan', githubLink: '', disabled: false },
  { title: 'Only4You', description: "India's learning platform for Ethical Hacking, Python, Web Development & AI — with 300+ lessons, live safe labs, an in-browser code editor, and an Azure AI Mentor, all for ₹99/year.", image: '/only4you.png', tags: ['React', 'Node.js', 'Learning Platform', 'Real-time'], color: '#43A047', link: 'https://only4you-app.vercel.app/', githubLink: '', disabled: false },
  { title: 'MSPulse', description: "Got tired of digging through Microsoft's website for real updates — so built a personal dashboard that auto-fetches and surfaces the latest Microsoft product and security updates on a clean, scheduled feed.", image: '/mspulse.png', tags: ['React', 'Automation', 'Microsoft', 'Scheduled Fetch', 'Dashboard'], color: '#0078D4', link: 'https://microsoftupdates.co.in/', githubLink: '', disabled: false },
];

async function seed() {
  // Get existing titles so we don't duplicate
  const existing = await db.execute('SELECT title FROM projects');
  const existingTitles = new Set(existing.rows.map(r => r.title));

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    if (existingTitles.has(p.title)) {
      console.log(`⏭️  Skipping (already exists): ${p.title}`);
      skipped++;
      continue;
    }
    await db.execute({
      sql: `INSERT INTO projects (title, description, image_url, tags, color, live_link, github_link, disabled, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.title,
        p.description,
        p.image,
        JSON.stringify(p.tags),
        p.color,
        p.link,
        p.githubLink,
        p.disabled ? 1 : 0,
        i + 1,
      ],
    });
    console.log(`✅ Inserted: ${p.title}`);
    inserted++;
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
