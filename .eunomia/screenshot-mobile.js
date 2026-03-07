import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 11 Pro Max', width: 414, height: 896 },
  { name: 'Android', width: 360, height: 640 },
];

const screenshotDir = path.join(__dirname, 'screenshots', 'qa');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
      const screenshotPath = path.join(screenshotDir, `${viewport.name.replace(/\s+/g, '-')}-${viewport.width}x${viewport.height}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`Captured: ${screenshotPath}`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
})();
