import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Reportix Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container": "#e8e8e7","tertiary-dim": "#5e26c7","surface-container-highest": "#dddddc",
        "secondary-fixed": "#8dedec","primary-fixed-dim": "#6aa6ef","tertiary-fixed-dim": "#b091ff",
        "on-primary-fixed-variant": "#003b6a","secondary-fixed-dim": "#7fdede","secondary-dim": "#005959",
        "surface": "#f7f6f5","on-tertiary-fixed": "#1f0052","surface-variant": "#dddddc",
        "on-surface-variant": "#5b5c5b","surface-dim": "#d4d4d3","on-tertiary-fixed-variant": "#4600a8",
        "surface-container-lowest": "#ffffff","inverse-primary": "#78b4fe","inverse-on-surface": "#9d9d9c",
        "inverse-surface": "#0d0e0e","tertiary": "#6a37d4","primary-dim": "#00518f","on-tertiary": "#f8f0ff",
        "on-secondary-fixed-variant": "#006262","on-primary-fixed": "#001932","surface-tint": "#0a5da2",
        "error-container": "#fb5151","on-background": "#2e2f2f","outline-variant": "#adadac",
        "surface-container-high": "#e2e2e1","background": "#f7f6f5","primary-fixed": "#78b4fe",
        "on-surface": "#2e2f2f","outline": "#767776","on-tertiary-container": "#3c0091",
        "secondary-container": "#8dedec","surface-bright": "#f7f6f5","on-primary-container": "#00325b",
        "tertiary-container": "#bda2ff","surface-container-low": "#f1f1ef","on-error": "#ffefee",
        "on-secondary-fixed": "#004343","error-dim": "#9f0519","on-secondary": "#bbfffe",
        "tertiary-fixed": "#bda2ff","on-primary": "#edf3ff","primary-container": "#78b4fe",
        "on-error-container": "#570008","secondary": "#006666","on-secondary-container": "#005858",
        "primary": "#0a5da2","error": "#b31b25"
      },
      fontFamily: { "headline": ["Manrope"], "body": ["Inter"], "label": ["Inter"] },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
}
</script>
<style>
  .glass-morphism { background: rgba(255,255,255,0.8); backdrop-filter: blur(24px); }
  .deep-bloom { box-shadow: 0 20px 40px rgba(10,93,162,0.06); }
  .asymmetric-card { border-radius: 1.5rem 0.5rem 1.5rem 0.5rem; }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
</style>
</head>
<body class="bg-surface font-body text-on-surface antialiased">
<aside class="flex flex-col fixed left-0 top-0 h-full bg-slate-50 font-manrope tracking-tight text-slate-800 h-screen w-64 border-r-0 z-50">
  <div class="px-6 py-8">
    <div class="flex items-center gap-3 mb-10">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-lg shadow-primary/20">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dataset</span>
      </div>
      <div>
        <h1 class="text-xl font-bold text-blue-700 leading-none">Intelligent Surface</h1>
        <p class="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Enterprise Flow</p>
      </div>
    </div>
    <nav class="space-y-1">
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-700 font-bold border-r-4 border-blue-700 bg-slate-100" href="#">
        <span class="material-symbols-outlined">dashboard</span><span>Dashboard</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500" href="#">
        <span class="material-symbols-outlined">description</span><span>Documents</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500" href="#">
        <span class="material-symbols-outlined">bolt</span><span>Automations</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500" href="#">
        <span class="material-symbols-outlined">insights</span><span>Analytics</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500" href="#">
        <span class="material-symbols-outlined">settings</span><span>Settings</span>
      </a>
    </nav>
  </div>
  <div class="mt-auto px-6 py-8 border-t border-slate-100">
    <button class="w-full py-3 px-4 mb-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-headline font-bold shadow-lg shadow-primary/25">New Report</button>
  </div>
</aside>
<header class="flex justify-between items-center w-full px-8 py-3 sticky top-0 z-40 ml-64 bg-white/80 backdrop-blur-md shadow-sm">
  <div class="flex items-center flex-1 max-w-xl">
    <div class="relative w-full">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
      <input class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full" placeholder="Search intelligent flows..." type="text"/>
    </div>
  </div>
  <div class="flex items-center gap-6">
    <div class="flex items-center gap-4">
      <button class="p-2 text-slate-600"><span class="material-symbols-outlined">notifications</span></button>
      <button class="p-2 text-slate-600"><span class="material-symbols-outlined">apps</span></button>
    </div>
    <div class="h-8 w-px bg-slate-200"></div>
    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-xs font-bold text-on-surface">Alex Chen</p>
        <p class="text-[10px] text-slate-400 uppercase tracking-tighter">System Architect</p>
      </div>
    </div>
  </div>
</header>
<main class="ml-64 p-8 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <div class="mb-10">
      <h2 class="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">System Overview</h2>
      <p class="text-on-surface-variant max-w-2xl">Curating enterprise document flows with real-time intelligence and automated precision.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-surface-container-lowest p-6 asymmetric-card deep-bloom flex flex-col justify-between">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-secondary-container rounded-xl text-on-secondary-container">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
          </div>
          <span class="text-xs font-bold text-secondary flex items-center gap-1"><span class="material-symbols-outlined text-xs">trending_up</span> +2.4%</span>
        </div>
        <div>
          <p class="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Automation Success</p>
          <h3 class="text-3xl font-headline font-extrabold text-primary">98%</h3>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 asymmetric-card deep-bloom flex flex-col justify-between">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-primary-container rounded-xl text-on-primary-container">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">article</span>
          </div>
          <span class="text-xs font-bold text-primary">Total volume</span>
        </div>
        <div>
          <p class="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Reports Generated</p>
          <h3 class="text-3xl font-headline font-extrabold text-primary">1,245</h3>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 asymmetric-card deep-bloom flex flex-col justify-between border-b-4 border-tertiary">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-tertiary-container rounded-xl text-on-tertiary-container">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dynamic_feed</span>
          </div>
          <span class="text-xs font-bold text-tertiary">In progress</span>
        </div>
        <div>
          <p class="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Active Workflows</p>
          <h3 class="text-3xl font-headline font-extrabold text-tertiary">12</h3>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 asymmetric-card deep-bloom flex flex-col justify-between">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-error-container/20 rounded-xl text-error">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">pending_actions</span>
          </div>
          <span class="px-2 py-1 bg-error-container text-[10px] text-on-error-container font-bold rounded-full">ACTION REQ</span>
        </div>
        <div>
          <p class="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Pending Approvals</p>
          <h3 class="text-3xl font-headline font-extrabold text-error">5</h3>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl deep-bloom relative overflow-hidden">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h4 class="text-lg font-headline font-bold text-on-surface">Report Generation Trends</h4>
            <p class="text-sm text-on-surface-variant">Intelligent output analytics for the last 30 days</p>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-xs font-bold bg-surface-container-low text-primary rounded-lg">Month</button>
            <button class="px-3 py-1 text-xs font-bold text-on-surface-variant rounded-lg">Week</button>
          </div>
        </div>
        <div class="h-64 flex items-end justify-between gap-2 relative">
          <div class="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
            <div class="border-t border-primary h-px w-full"></div>
            <div class="border-t border-primary h-px w-full"></div>
            <div class="border-t border-primary h-px w-full"></div>
            <div class="border-t border-primary h-px w-full"></div>
          </div>
          <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
            <defs>
              <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stop-color="#0a5da2" stop-opacity="0.2"></stop>
                <stop offset="100%" stop-color="#0a5da2" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,60 T500,90 T600,40 T700,70 T800,50 L800,200 L0,200 Z" fill="url(#chartGradient)"></path>
            <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,60 T500,90 T600,40 T700,70 T800,50" fill="none" stroke="#0a5da2" stroke-linecap="round" stroke-width="3"></path>
          </svg>
        </div>
        <div class="mt-8 flex justify-between text-[10px] font-label text-slate-400 uppercase tracking-widest px-2">
          <span>Day 01</span><span>Day 10</span><span>Day 20</span><span>Day 30</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-8 rounded-xl deep-bloom border-l-4 border-secondary">
        <div class="flex items-center justify-between mb-8">
          <h4 class="text-lg font-headline font-bold text-on-surface">Recent Activity</h4>
          <span class="text-[10px] font-bold text-secondary-dim bg-secondary-container px-2 py-1 rounded">LIVE</span>
        </div>
        <div class="space-y-6 relative">
          <div class="absolute left-4 top-2 bottom-2 w-px bg-surface-container-high"></div>
          <div class="relative pl-10">
            <div class="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-secondary ring-4 ring-white"></div>
            <p class="text-sm font-medium text-on-surface">Report #421 Generated Successfully</p>
            <p class="text-xs text-on-surface-variant mt-1">2 mins ago • Financial Audit Flow</p>
          </div>
          <div class="relative pl-10">
            <div class="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-tertiary ring-4 ring-white"></div>
            <p class="text-sm font-medium text-on-surface">Workflow #12 Requires Attention</p>
            <p class="text-xs text-on-surface-variant mt-1">15 mins ago • Signature Missing</p>
          </div>
          <div class="relative pl-10">
            <div class="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-secondary ring-4 ring-white"></div>
            <p class="text-sm font-medium text-on-surface">New Automation Rule Published</p>
            <p class="text-xs text-on-surface-variant mt-1">1 hour ago • By Alex Chen</p>
          </div>
          <div class="relative pl-10">
            <div class="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-outline-variant ring-4 ring-white"></div>
            <p class="text-sm font-medium text-on-surface">Batch Processing Completed</p>
            <p class="text-xs text-on-surface-variant mt-1">3 hours ago • 154 Items</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
</body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: path.join(__dirname, '..', 'public', 'reportix.png') });
await browser.close();
console.log('Saved public/reportix.png');
