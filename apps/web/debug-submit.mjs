import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));

  try {
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
    
    // Fill the signup form
    const emailInput = page.getByLabel(/Email address/i);
    if (await emailInput.isVisible()) {
        await emailInput.fill('testuser_signup2024@example.com');
    } else {
        await page.getByPlaceholder('name@company.com').fill('testuser_signup2024@example.com');
    }
    
    const passwordInput = page.getByLabel(/Password/i);
    if (await passwordInput.isVisible()) {
        await passwordInput.fill('TestPassword123!');
    } else {
        await page.getByPlaceholder('••••••••').fill('TestPassword123!');
    }
    
    await page.getByRole('button', { name: /Create Account|Continue/i }).click();
    await page.waitForTimeout(3000);
    
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    await page.getByPlaceholder('name@company.com').fill('testuser_signup2024@example.com');
    await page.getByPlaceholder('••••••••').fill('TestPassword123!');
    await page.getByRole('button', { name: /SIGN IN TO FORGE|Continue/i }).click();
    await page.waitForTimeout(3000);

  } catch(err) {
    console.error("Test script error:", err);
  }

  await browser.close();
})();
