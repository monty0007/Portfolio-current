import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const sites = [
  { url: 'https://oryn.maoverse.xyz/', filename: 'oryn.png' },
  { url: 'https://docreaper.maoverse.xyz/', filename: 'docreaper.png' },
  { url: 'https://super-mario-kart-902002915057.asia-south1.run.app/', filename: 'mariokart.png' },
  { url: 'http://calcai.maoverse.xyz/', filename: 'azurecalc.png' },
];

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const site of sites) {
  try {
    console.log(`Capturing ${site.url}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(publicDir, site.filename), fullPage: false });
    await page.close();
    console.log(`  Saved -> public/${site.filename}`);
  } catch (err) {
    console.error(`  Failed for ${site.url}: ${err.message}`);
  }
}

await browser.close();
console.log('Done.');
