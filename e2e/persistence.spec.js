const { test, expect } = require('@playwright/test');

test.describe('Persistence - E2E Tests', () => {
  test('Golden Path: Login exitoso redirige al dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@uni.edu');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Hola');
  });

  test('Happy Path: Datos de sesión persisten después de navegación', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@uni.edu');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 10000 });

    await page.goto('/courses');
    await expect(page).toHaveURL(/\/courses/);

    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Hola');
  });

  test('Happy Path: Navegación a campus como coordinador', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@uni.edu');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 10000 });

    await page.goto('/campus');
    await expect(page).toHaveURL(/\/campus/);
    await expect(page.locator('h1')).toContainText('Campus');
  });

  test('Happy Path: Navegación a docentes como coordinador', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@uni.edu');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 10000 });

    await page.goto('/teachers');
    await expect(page).toHaveURL(/\/teachers/);
    await expect(page.locator('h1')).toContainText('Docentes');
  });
});
