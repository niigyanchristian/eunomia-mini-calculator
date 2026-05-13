import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viewports = [
  { name: 'iPhone-SE', width: 375, height: 667 },
  { name: 'iPhone-XR', width: 414, height: 896 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

(async () => {
  const browser = await chromium.launch();
  const screenshotDir = path.join(__dirname, '.eunomia/screenshots/qa');

  await mkdir(screenshotDir, { recursive: true });
  
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    
    const page = await context.newPage();
    await page.goto('http://localhost:5173/');
    await page.fill('#email', 'test@gmail.com');
    await page.fill('#password', 'test123');
    await page.click('button:has-text("Login")');
    await page.waitForSelector('.calculator');
    
    const screenshotPath = path.join(
      screenshotDir,
      `${viewport.name}-${viewport.width}x${viewport.height}.png`
    );
    
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved: ${screenshotPath}`);
    
    await context.close();
  }
  
  await browser.close();
  console.log('All screenshots captured successfully!');
})();
