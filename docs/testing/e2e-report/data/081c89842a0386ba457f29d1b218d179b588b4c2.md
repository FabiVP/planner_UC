# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.js >> Security - E2E Tests >> Unhappy Path: Login con credenciales inválidas muestra error
- Location: e2e\security.spec.js:38:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.login-error')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.login-error')
    - waiting for" http://localhost:5173/login" navigation to finish...
    - navigated to "http://localhost:5173/login"

```

```yaml
- heading "UniScheduler" [level=1]
- paragraph: Sistema Inteligente de Generación de Horarios
- text: Correo electrónico
- textbox "Correo electrónico":
  - /placeholder: correo@universidad.edu
  - text: admin@uni.edu
- text: Contraseña
- textbox "Contraseña":
  - /placeholder: ••••••••
  - text: admin123
- button "Iniciar sesión"
- text: "Acceso rápido:"
- button "Coordinador"
- button "Docente"
- button "Estudiante"
- paragraph: Universidad Continental · Taller de Proyectos 2
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Security - E2E Tests', () => {
  4  |   test('Unhappy Path: Redirección a login sin autenticación', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveURL(/\/login/);
  7  |   });
  8  | 
  9  |   test('Unhappy Path: Acceso a dashboard sin auth redirige', async ({ page }) => {
  10 |     await page.goto('/dashboard');
  11 |     await expect(page).toHaveURL(/\/login/);
  12 |   });
  13 | 
  14 |   test('Unhappy Path: Acceso a campus sin auth redirige', async ({ page }) => {
  15 |     await page.goto('/campus');
  16 |     await expect(page).toHaveURL(/\/login/);
  17 |   });
  18 | 
  19 |   test('Unhappy Path: Acceso a teachers sin auth redirige', async ({ page }) => {
  20 |     await page.goto('/teachers');
  21 |     await expect(page).toHaveURL(/\/login/);
  22 |   });
  23 | 
  24 |   test('Unhappy Path: Acceso a students sin auth redirige', async ({ page }) => {
  25 |     await page.goto('/students');
  26 |     await expect(page).toHaveURL(/\/login/);
  27 |   });
  28 | 
  29 |   test('Unhappy Path: Token inválido redirige a login', async ({ page }) => {
  30 |     await page.goto('/login');
  31 |     await page.evaluate(() => {
  32 |       localStorage.setItem('token', 'invalid-token');
  33 |     });
  34 |     await page.goto('/');
  35 |     await expect(page).toHaveURL(/\/login/);
  36 |   });
  37 | 
  38 |   test('Unhappy Path: Login con credenciales inválidas muestra error', async ({ page }) => {
  39 |     await page.goto('/login');
  40 |     await page.fill('#email', 'fake@test.com');
  41 |     await page.fill('#password', 'wrongpass');
  42 |     await page.click('button[type="submit"]');
> 43 |     await expect(page.locator('.login-error')).toBeVisible({ timeout: 5000 });
     |                                                ^ Error: expect(locator).toBeVisible() failed
  44 |   });
  45 | 
  46 |   test('Unhappy Path: Login con campos vacíos', async ({ page }) => {
  47 |     await page.goto('/login');
  48 |     await page.click('button[type="submit"]');
  49 |     const emailInput = page.locator('#email');
  50 |     const validationMessage = await emailInput.evaluate(el => el.validationMessage);
  51 |     expect(validationMessage).not.toBe('');
  52 |   });
  53 | });
  54 | 
```