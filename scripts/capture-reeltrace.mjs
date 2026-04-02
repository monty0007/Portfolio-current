import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ReelTrace | Travel Discovery Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"><\/script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-background": "#191c1d","inverse-on-surface": "#f0f1f2","on-error-container": "#93000a",
        "surface-container": "#edeeef","on-secondary-container": "#305e80","primary-fixed-dim": "#ffb598",
        "on-surface": "#191c1d","outline-variant": "#e3bfb2","secondary": "#366285","error": "#ba1a1a",
        "surface-tint": "#a63c00","inverse-surface": "#2e3132","on-surface-variant": "#5a4137",
        "primary": "#a23a00","on-secondary-fixed": "#001d31","surface-container-low": "#f3f4f5",
        "error-container": "#ffdad6","surface-variant": "#e1e3e4","surface-dim": "#d9dadb",
        "tertiary": "#815200","surface": "#f8f9fa","inverse-primary": "#ffb598",
        "on-primary-fixed-variant": "#7e2c00","on-primary-container": "#fffbff",
        "on-secondary-fixed-variant": "#1a4a6c","secondary-fixed": "#cce5ff","outline": "#8e7165",
        "on-secondary": "#ffffff","on-error": "#ffffff","secondary-fixed-dim": "#a0cbf3",
        "on-tertiary": "#ffffff","tertiary-container": "#a26800","on-tertiary-container": "#fffbff",
        "on-primary": "#ffffff","surface-container-lowest": "#ffffff","tertiary-fixed-dim": "#ffb95a",
        "primary-fixed": "#ffdbce","tertiary-fixed": "#ffddb6","on-tertiary-fixed-variant": "#643f00",
        "on-primary-fixed": "#370e00","primary-container": "#ca4b00","secondary-container": "#abd6ff",
        "surface-container-highest": "#e1e3e4","background": "#f8f9fa","on-tertiary-fixed": "#2a1800",
        "surface-bright": "#f8f9fa","surface-container-high": "#e7e8e9"
      },
      fontFamily: { "headline": ["Plus Jakarta Sans"], "body": ["Plus Jakarta Sans"], "label": ["Plus Jakarta Sans"] },
      borderRadius: { "DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px" },
    },
  },
}
<\/script>
<style>
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }
<\/style>
</head>
<body class="bg-surface text-on-surface">
<aside class="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r-0 flex-col py-8 px-4 bg-slate-50 font-plus-jakarta tracking-tight z-50">
  <div class="mb-10 px-2 flex items-center gap-3">
    <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
      <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">explore</span>
    </div>
    <div>
      <h1 class="text-xl font-bold text-slate-900 leading-none">ReelTrace</h1>
      <p class="text-xs text-slate-500 mt-1">Immersive Explorer</p>
    </div>
  </div>
  <nav class="flex-1 space-y-2">
    <a class="flex items-center gap-3 px-4 py-3 rounded-lg text-orange-700 font-semibold border-r-2 border-orange-700 bg-orange-50/50" href="#">
      <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">explore</span><span>Explore</span>
    </a>
    <a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500" href="#"><span class="material-symbols-outlined">bookmark</span><span>Saved Reels</span></a>
    <a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500" href="#"><span class="material-symbols-outlined">map</span><span>Itineraries</span></a>
    <a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500" href="#"><span class="material-symbols-outlined">settings</span><span>Settings</span></a>
  </nav>
  <button class="mt-auto w-full py-4 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-2">
    <span class="material-symbols-outlined">add_location</span>Plan New Trip
  </button>
</aside>
<main class="md:ml-64 min-h-screen">
  <header class="w-full sticky top-0 z-40 bg-white/70 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 py-4">
    <div class="flex items-center gap-4 flex-1">
      <div class="relative w-full max-w-md hidden sm:block">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input class="w-full bg-slate-100/50 border-none rounded-full py-2 pl-10 pr-4 text-sm" placeholder="Search destinations..." type="text"/>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 rounded-full text-slate-600 relative">
        <span class="material-symbols-outlined">notifications</span>
        <span class="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full"></span>
      </button>
    </div>
  </header>
  <div class="px-6 md:px-12 py-10 space-y-20">
    <section class="relative rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center text-center p-8">
      <div class="absolute inset-0 z-0">
        <img alt="Scenic travel destination" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnVYYoJN1CEzJUlRvj0Jbg2NprtoJmNDhqo_08O3hqX2IaiV-YfRJkG_fEVqKS1FtSI_FhTKdevJ0vCalUk13t8HwPWHYX6l2VUiDqOC6tg1jQ1MCkGuouT-03CRzQ46p4jjDvTABRt2C6fNKVIKdHNAhHEM__kOz6nUMy8l-MzI_FGChwazWHsWMOLh70wg_V5niJ9U3t3yD0oYC-1AxvrFZo-9sGwe_af4woaLBBlM3yPAghrxAm44HPfWxeSzOQhlR4Yq9zGeKn"/>
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>
      </div>
      <div class="relative z-10 w-full max-w-3xl space-y-8">
        <div class="space-y-4">
          <h2 class="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">Where did that Reel take you?</h2>
          <p class="text-lg md:text-xl text-white/90 font-medium">Paste an Instagram Reel link to pinpoint the location and generate your custom itinerary.</p>
        </div>
        <div class="bg-white/10 backdrop-blur-2xl p-2 rounded-full border border-white/20 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto shadow-2xl">
          <div class="flex-1 flex items-center gap-3 px-6 w-full">
            <span class="material-symbols-outlined text-white/80">link</span>
            <input class="bg-transparent border-none w-full text-white placeholder-white/60 focus:ring-0 text-lg py-4" placeholder="https://www.instagram.com/reels/..." type="text"/>
          </div>
          <button class="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center">
            <span class="material-symbols-outlined">location_searching</span>Trace Now
          </button>
        </div>
        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <span class="text-white/70 text-sm font-medium">Trending searches:</span>
          <a class="text-white text-sm bg-white/20 px-4 py-1 rounded-full backdrop-blur-md" href="#">#IcelandWaterfalls</a>
          <a class="text-white text-sm bg-white/20 px-4 py-1 rounded-full backdrop-blur-md" href="#">#AmalfiCoast</a>
          <a class="text-white text-sm bg-white/20 px-4 py-1 rounded-full backdrop-blur-md" href="#">#TokyoHiddenGems</a>
        </div>
      </div>
    </section>
    <section class="space-y-10">
      <div class="flex items-end justify-between px-2">
        <div class="space-y-2">
          <span class="text-primary font-bold uppercase tracking-widest text-xs">Curated for you</span>
          <h3 class="text-3xl font-extrabold text-on-surface tracking-tight">Trending Destinations</h3>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div class="relative h-96 overflow-hidden">
            <img alt="Bali" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlNreZwdVAWrmjytcCAtpYVDyLnHAYCkFEFB6sK-8FiAmls1WWT2EiuwSTIsRWPlyOS3z7xeWdRSZNHqNhIpjdnMWzpkk4oUmPmCiWpmguzeVMUP7e7JAohX-ihB8hZDwD64FYvsdp0i8Ovsh9o-ISWuQE5vXvC-rnFpF_ChxBPPQ6WHclK65ZNrRm9RnhD38qDDnPev1F9YDs77GWW_8tZgjWJ75WgneYVi_ofNkLGYA_RErUsaNqqMpqJoxe17-cNSXV9m-bC9MG"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            <div class="absolute top-4 left-4">
              <span class="bg-primary/90 backdrop-blur-md text-on-primary px-3 py-1 rounded-full text-xs font-bold">VIRAL</span>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col space-y-4">
            <div class="flex justify-between items-start">
              <div><h4 class="text-xl font-bold">Tegalalang Rice Terrace</h4><p class="text-secondary font-medium text-sm">Ubud, Bali</p></div>
              <div class="text-right"><span class="block font-black text-primary text-lg">4.9</span><span class="text-[10px] text-slate-400 uppercase font-bold">12k Reels</span></div>
            </div>
            <button class="mt-auto w-full py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg">auto_awesome</span>Generate Itinerary
            </button>
          </div>
        </div>
        <div class="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div class="relative h-96 overflow-hidden">
            <img alt="Venice" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6FCdrouI5c1ghduTKIpDpM5k6Pis23moS9_X4HU1iQXR93Nn8eUAYie_djr_25mDMCOrhJOT32kgVly29t1_YOuE-mH6YMdJGITZbNz7WFeUwqBFteBZ-Ku8obKBRHPBtRpt88BrrSEFSyzE-csRY2GYbaiyfIclt_zaPmUk-ENCCKYybfdN2MX11NyfY1pENbgrKOq-n7U78UXEmqcJWexceabzMnV1i0LjYoekz6oARQwFC60uxIok30xodNagHvZKIw6qZ9A_7"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          </div>
          <div class="p-6 flex-1 flex flex-col space-y-4">
            <div class="flex justify-between items-start">
              <div><h4 class="text-xl font-bold">The Grand Canal</h4><p class="text-secondary font-medium text-sm">Venice, Italy</p></div>
              <div class="text-right"><span class="block font-black text-primary text-lg">4.7</span><span class="text-[10px] text-slate-400 uppercase font-bold">8.4k Reels</span></div>
            </div>
            <button class="mt-auto w-full py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg">auto_awesome</span>Generate Itinerary
            </button>
          </div>
        </div>
        <div class="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div class="relative h-96 overflow-hidden">
            <img alt="Banff" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUFljLZzNsk4UXk6yw5YEbkAF1yn699co0aoQi1TnWSOSB-logbPbqvtw_tIINSJMdkHDUT5T2FvUX-_wjCSJ0blTQXoqyFMfEjr6c3qO8vBuuvvczu0QrQ5DiS9caeZJLmx3_ThxpqEaS9mjCYgUW5njq0k0-vmwjt-2uM17xXgc8FytjC3uTXIjFj5V5cr33QiwMMk4uqh226wRcGgMKyDg1kR8V8rU_UQuNugsU9ipH2nlKP0M6MuDj19Ah82DeGSF9WF-ndLAG"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            <div class="absolute top-4 left-4">
              <span class="bg-secondary/90 text-on-secondary px-3 py-1 rounded-full text-xs font-bold">TOP PICK</span>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col space-y-4">
            <div class="flex justify-between items-start">
              <div><h4 class="text-xl font-bold">Moraine Lake</h4><p class="text-secondary font-medium text-sm">Alberta, Canada</p></div>
              <div class="text-right"><span class="block font-black text-primary text-lg">5.0</span><span class="text-[10px] text-slate-400 uppercase font-bold">25k Reels</span></div>
            </div>
            <button class="mt-auto w-full py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg">auto_awesome</span>Generate Itinerary
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</main>
</body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 40000 });
await new Promise(r => setTimeout(r, 4000));
await page.screenshot({ path: path.join(__dirname, '..', 'public', 'reeltrace.png') });
await browser.close();
console.log('Saved public/reeltrace.png');
