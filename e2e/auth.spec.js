const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  test('Golden Path: Login con credenciales válidas redirige al dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@uni.edu');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('Unhappy Path: Login con credenciales inválidas muestra error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'invalido@test.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toBeVisible({ timeout: 5000 });
  });

  test('Unhappy Path: Login con email vacío', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    const emailInput = page.locator('#email');
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });

  test('Unhappy Path: Redirección a /login si no está autenticado', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Edge Case: Acceso rápido Coordinador llena campos', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Coordinador")');
    await expect(page.locator('#email')).toHaveValue('admin@uni.edu');
    await expect(page.locator('#password')).toHaveValue('admin123');
  });
});
