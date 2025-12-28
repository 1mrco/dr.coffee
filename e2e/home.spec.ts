import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is visible
    await expect(page.getByText('START YOUR DAY')).toBeVisible();
    await expect(page.getByText('THE RIGHT WAY')).toBeVisible();
  });

  test('should have navigation header', async ({ page }) => {
    await page.goto('/');
    
    // Check if logo is visible in header (first occurrence)
    await expect(page.getByRole('link', { name: 'Dr.Coffee' }).first()).toBeVisible();
    
    // Check if navigation links are present in header
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Menu' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('should navigate to menu page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Menu link in navigation
    const nav = page.getByRole('navigation');
    await nav.getByRole('link', { name: 'Menu' }).first().click();
    
    // Verify we're on the menu page
    await expect(page).toHaveURL('/menu');
    await expect(page.getByText('Our Menu')).toBeVisible();
  });

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check for ORDER NOW button in hero section
    const main = page.getByRole('main');
    await expect(main.getByRole('link', { name: 'ORDER NOW' })).toBeVisible();
    
    // Check for VIEW MENU button
    await expect(main.getByRole('link', { name: 'VIEW MENU' })).toBeVisible();
  });

  test('should display brand values section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to brand values section
    await page.getByText('More Than Coffee').scrollIntoViewIfNeeded();
    
    // Check if brand values are visible
    await expect(page.getByText('More Than Coffee')).toBeVisible();
    await expect(page.getByText('Energy that lasts')).toBeVisible();
  });
});

