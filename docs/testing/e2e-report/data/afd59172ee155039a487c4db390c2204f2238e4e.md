# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flow >> Unhappy Path: Login con credenciales inválidas muestra error
- Location: e2e\auth.spec.js:12:3

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
  3  | test.describe('Authentication Flow', () => {
  4  |   test('Golden Path: Login con credenciales válidas redirige al dashboard', async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.fill('#email', 'admin@uni.edu');
  7  |     await page.fill('#password', 'admin123');
  8  |     await page.click('button[type="submit"]');
  9  |     await expect(page).toHaveURL('/', { timeout: 10000 });
  10 |   });
  11 | 
  12 |   test('Unhappy Path: Login con credenciales inválidas muestra error', async ({ page }) => {
  13 |     await page.goto('/login');
  14 |     await page.fill('#email', 'invalido@test.com');
  15 |     await page.fill('#password', 'wrongpass');
  16 |     await page.click('button[type="submit"]');
> 17 |     await expect(page.locator('.login-error')).toBeVisible({ timeout: 5000 });
     |                                                ^ Error: expect(locator).toBeVisible() failed
  18 |   });
  19 | 
  20 |   test('Unhappy Path: Login con email vacío', async ({ page }) => {
  21 |     await page.goto('/login');
  22 |     await page.fill('#password', 'admin123');
  23 |     await page.click('button[type="submit"]');
  24 |     const emailInput = page.locator('#email');
  25 |     const validationMessage = await emailInput.evaluate(el => el.validationMessage);
  26 |     expect(validationMessage).not.toBe('');
  27 |   });
  28 | 
  29 |   test('Unhappy Path: Redirección a /login si no está autenticado', async ({ page }) => {
  30 |     await page.goto('/');
  31 |     await expect(page).toHaveURL(/\/login/);
  32 |   });
  33 | 
  34 |   test('Edge Case: Acceso rápido Coordinador llena campos', async ({ page }) => {
  35 |     await page.goto('/login');
  36 |     await page.click('button:has-text("Coordinador")');
  37 |     await expect(page.locator('#email')).toHaveValue('admin@uni.edu');
  38 |     await expect(page.locator('#password')).toHaveValue('admin123');
  39 |   });
  40 | });
  41 | 
```