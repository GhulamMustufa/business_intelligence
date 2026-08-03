import { chromium } from 'playwright';

(async () => {
  console.log("Starting browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('NETWORK FAILED:', request.url(), request.failure().errorText));

  console.log("Navigating to /signup...");
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
  console.log("Waiting a bit...");
  await page.waitForTimeout(3000);
  
  console.log("Navigating to /login...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  console.log("Waiting a bit...");
  await page.waitForTimeout(3000);

  await browser.close();
})();
