const { chromium } = require('playwright');
const path = require('path');

const viewports = [
  { name: 'iPhone-SE', width: 375, height: 667 },
  { name: 'iPhone-XR', width: 414, height: 896 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

(async () => {
  const browser = await chromium.launch();
  
  for (const viewport of viewports) {
    const context = await browser.createContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    
    const page = await context.newPage();
    await page.goto('http://localhost:5173/');
    
    const screenshotPath = path.join(
      process.cwd(),
      '.eunomia/screenshots/qa',
      `${viewport.name}-${viewport.width}x${viewport.height}.png`
    );
    
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved: ${screenshotPath}`);
    
    await context.close();
  }
  
  await browser.close();
  console.log('All screenshots captured successfully!');
})();
