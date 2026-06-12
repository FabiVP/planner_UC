const { test, expect } = require('@playwright/test');

test.describe('Security - E2E Tests', () => {
  test('Unhappy Path: Redirección a login sin autenticación', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unhappy Path: Acceso a dashboard sin auth redirige', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unhappy Path: Acceso a campus sin auth redirige', async ({ page }) => {
    await page.goto('/campus');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unhappy Path: Acceso a teachers sin auth redirige', async ({ page }) => {
    await page.goto('/teachers');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unhappy Path: Acceso a students sin auth redirige', async ({ page }) => {
    await page.goto('/students');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unhappy Path: Token inválido redirige a login', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('token', 'invalid-token');
    });
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unhappy Path: Login con credenciales inválidas muestra error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'fake@test.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toBeVisible({ timeout: 5000 });
  });

  test('Unhappy Path: Login con campos vacíos', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    const emailInput = page.locator('#email');
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });
});
