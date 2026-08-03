import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('Signup form validation', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('/signup');

    // Ensure the page has loaded
    await expect(page.getByRole('heading', { name: 'LeadForge AI' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();

    // Click the submit button without filling in any fields
    await page.getByRole('button', { name: 'CREATE ACCOUNT' }).click();

    // Verify the toast error message appears
    await expect(page.getByText('Please enter an email address.')).toBeVisible();

    // Fill in email but no password
    await page.getByPlaceholder('name@company.com').fill('test@example.com');
    await page.getByRole('button', { name: 'CREATE ACCOUNT' }).click();

    // Verify the password toast error appears
    await expect(page.getByText('Please enter a password.')).toBeVisible();
  });

  test('Login form validation', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Ensure the page has loaded
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

    // Click the submit button without filling in any fields
    await page.getByRole('button', { name: 'SIGN IN TO FORGE' }).click();

    // Verify the toast error message appears
    await expect(page.getByText('Please enter your email address.')).toBeVisible();
  });
});
