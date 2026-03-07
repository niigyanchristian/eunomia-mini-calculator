import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viewports = [
  { name: 'iPhone-SE', width: 375, height: 667 },
  { name: 'iPhone-XR', width: 414, height: 896 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

(async () => {
  const browser = await chromium.launch();
  
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height }
    });
    
    await page.goto('http://localhost:5173/');
    
    const screenshotPath = path.join(
      __dirname,
      '.eunomia/screenshots/qa',
      `${viewport.name}-${viewport.width}x${viewport.height}.png`
    );
    
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved: ${screenshotPath}`);
    
    await page.close();
  }
  
  await browser.close();
  console.log('All screenshots captured successfully!');
})();
