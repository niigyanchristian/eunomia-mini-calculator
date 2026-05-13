import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 }
];

async function runVisualTests() {
  const browser = await chromium.launch();
  const screenshotDir = '.eunomia/screenshots/qa';

  // Create screenshot directory
  await mkdir(screenshotDir, { recursive: true });

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });

    const page = await context.newPage();

    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Sign in so the calculator view is available for visual validation.
    await page.fill('#email', 'test@gmail.com');
    await page.fill('#password', 'test123');
    await page.click('button:has-text("Login")');

    // Wait for calculator to be visible
    await page.waitForSelector('.calculator');

    // Perform a calculation to verify functionality
    await page.click('button:has-text("3")');
    await page.click('button:has-text("+")');
    await page.click('button:has-text("7")');
    await page.click('button:has-text("=")');

    // Verify display shows correct result
    const displayText = await page.textContent('.display');
    if (displayText !== '10') {
      throw new Error(`Calculator malfunction at ${viewport.name} viewport: expected 10, got ${displayText}`);
    }

    // Take screenshot
    await page.screenshot({
      path: `${screenshotDir}/calculator-${viewport.name}-${viewport.width}x${viewport.height}.png`,
      fullPage: true
    });

    console.log(`✓ ${viewport.name} (${viewport.width}x${viewport.height}): Calculator functional and screenshot captured`);

    await context.close();
  }

  await browser.close();
  console.log('\n✓ All visual validations completed successfully');
}

runVisualTests().catch(error => {
  console.error('Visual test failed:', error);
  process.exit(1);
});
