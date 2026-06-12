const { test, expect } = require('@playwright/test');

test.describe('Navegación', () => {
  test('Unhappy Path: Ruta inexistente no lanza error', async ({ page }) => {
    const response = await page.goto('/ruta-inexistente', { waitUntil: 'domcontentloaded' });
    expect(response.status()).toBeLessThan(600);
  });

  test('Unhappy Path: Página de login es accesible sin autenticación', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('UniScheduler');
  });

  test('Unhappy Path: Redirección a login al acceder a dashboard sin auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unhappy Path: Redirección a login al acceder a campus sin auth', async ({ page }) => {
    await page.goto('/campus');
    await expect(page).toHaveURL(/\/login/);
  });
});
