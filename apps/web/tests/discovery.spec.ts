import { test, expect } from '@playwright/test';

test.describe('Discovery Page Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByPlaceholder('name@company.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'SIGN IN TO FORGE' }).click();
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
  });

  test('Search with all filters', async ({ page }) => {
    // Navigate to Discovery page
    await page.getByRole('link', { name: 'Discovery' }).click();
    await page.waitForURL('**/discovery*');

    // 1. Enter keyword
    const keywordInput = page.getByPlaceholder('e.g. B2B, Series A');
    await keywordInput.fill('Plumber');
    await keywordInput.press('Enter');

    // Wait for URL to update
    await page.waitForURL('**/discovery*search=Plumber*');

    // 2. Select Broad Region (e.g. United States)
    await page.getByLabel('United States').click();
    await page.waitForURL('**/discovery*locations=United*');

    // 3. Enter detailed location (Country)
    const countryInput = page.getByPlaceholder('Country');
    await countryInput.fill('USA');
    await countryInput.press('Enter');
    await page.waitForURL('**/discovery*country=USA*');

    // 4. Select Industry
    const industryCheckbox = page.locator('span').filter({ hasText: /^Healthcare$/ });
    await industryCheckbox.click();
    await page.waitForURL('**/discovery*industries=Healthcare*');

    // Since the API should now return some items or empty gracefully,
    // let's just make sure the page hasn't crashed.
    await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible();
    
    // Check if the Reset All button works to clear filters
    await page.getByRole('button', { name: 'Reset All' }).click();
    await page.waitForURL('**/discovery'); // should be clean URL
  });
});
