import { test, expect } from '@playwright/test';

test.describe('Menu Page', () => {
  test('should load the menu page', async ({ page }) => {
    await page.goto('/menu');
    
    // Check if menu page title is visible
    await expect(page.getByText('Our Menu')).toBeVisible();
  });

  test('should have filter buttons', async ({ page }) => {
    await page.goto('/menu');
    
    // Check for temperature filter buttons (first set)
    await expect(page.getByRole('button', { name: 'All', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cold' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hot', exact: true }).first()).toBeVisible();
  });

  test('should filter by Cold drinks', async ({ page }) => {
    await page.goto('/menu');
    
    // Click on Cold filter
    await page.getByRole('button', { name: 'Cold' }).click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Verify filter button is active (has purple background)
    const coldButton = page.getByRole('button', { name: 'Cold' });
    await expect(coldButton).toHaveClass(/bg-purple-500/);
  });
});

