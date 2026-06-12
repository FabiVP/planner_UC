# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flow >> Unhappy Path: Login con email vacío
- Location: e2e\auth.spec.js:20:3

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not ""
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - generic [ref=e9]: UniScheduler
    - navigation [ref=e10]:
      - link "Inicio" [ref=e11] [cursor=pointer]:
        - /url: /
        - img [ref=e13]
        - generic [ref=e15]: Inicio
      - link "Planificación" [ref=e16] [cursor=pointer]:
        - /url: /planning
        - img [ref=e18]
        - generic [ref=e20]: Planificación
      - link "Mis horarios" [ref=e21] [cursor=pointer]:
        - /url: /my-schedules
        - img [ref=e23]
        - generic [ref=e25]: Mis horarios
      - link "Restricciones" [ref=e26] [cursor=pointer]:
        - /url: /restrictions
        - img [ref=e28]
        - generic [ref=e30]: Restricciones
      - link "Reportes" [ref=e31] [cursor=pointer]:
        - /url: /reports
        - img [ref=e33]
        - generic [ref=e35]: Reportes
      - link "Notificaciones" [ref=e36] [cursor=pointer]:
        - /url: /notifications
        - img [ref=e38]
        - generic [ref=e40]: Notificaciones
      - link "Ayuda" [ref=e41] [cursor=pointer]:
        - /url: /help
        - img [ref=e43]
        - generic [ref=e45]: Ayuda
      - generic [ref=e46]: Administración
      - link "Carreras" [ref=e47] [cursor=pointer]:
        - /url: /careers
        - img [ref=e49]
        - generic [ref=e53]: Carreras
      - link "Asignaturas" [ref=e54] [cursor=pointer]:
        - /url: /courses
        - img [ref=e56]
        - generic [ref=e58]: Asignaturas
      - link "Docentes" [ref=e59] [cursor=pointer]:
        - /url: /teachers
        - img [ref=e61]
        - generic [ref=e63]: Docentes
      - link "Estudiantes" [ref=e64] [cursor=pointer]:
        - /url: /students
        - img [ref=e66]
        - generic [ref=e68]: Estudiantes
      - link "Aulas" [ref=e69] [cursor=pointer]:
        - /url: /classrooms
        - img [ref=e71]
        - generic [ref=e73]: Aulas
      - link "Campus / Sedes" [ref=e74] [cursor=pointer]:
        - /url: /campus
        - img [ref=e76]
        - generic [ref=e78]: Campus / Sedes
      - link "Generar Horarios" [ref=e79] [cursor=pointer]:
        - /url: /career-generation
        - img [ref=e81]
        - generic [ref=e83]: Generar Horarios
      - generic [ref=e84]: Preferencias
      - link "Políticas Institucionales" [ref=e85] [cursor=pointer]:
        - /url: /policies
        - img [ref=e87]
        - generic [ref=e89]: Políticas Institucionales
      - link "Pref. Docentes" [ref=e90] [cursor=pointer]:
        - /url: /teacher-preferences
        - img [ref=e92]
        - generic [ref=e94]: Pref. Docentes
      - link "Pref. Estudiantes" [ref=e95] [cursor=pointer]:
        - /url: /student-preferences
        - img [ref=e97]
        - generic [ref=e101]: Pref. Estudiantes
    - link "C Carlos Mendoza Coordinador" [ref=e103] [cursor=pointer]:
      - /url: /profile
      - generic [ref=e104]: C
      - generic [ref=e105]:
        - generic [ref=e106]: Carlos Mendoza
        - generic [ref=e107]: Coordinador
  - generic [ref=e108]:
    - banner [ref=e109]:
      - generic [ref=e111]:
        - img [ref=e112]
        - textbox "Buscar..." [ref=e114]
      - generic [ref=e115]:
        - button "Notificaciones" [ref=e116] [cursor=pointer]:
          - img [ref=e117]
        - button "Cerrar sesión" [ref=e120] [cursor=pointer]:
          - img [ref=e121]
    - main [ref=e123]:
      - generic [ref=e124]:
        - generic [ref=e125]:
          - generic [ref=e126]:
            - heading "¡Hola, Carlos!" [level=1] [ref=e127]
            - paragraph [ref=e128]: Bienvenido a UniScheduler · Coordinador
          - button "Generar horario" [ref=e129] [cursor=pointer]:
            - img [ref=e130]
            - text: Generar horario
        - generic [ref=e132]:
          - generic [ref=e133]:
            - img [ref=e135]
            - generic [ref=e139]:
              - generic [ref=e140]: "0"
              - text: Asignaturas
          - generic [ref=e141]:
            - img [ref=e143]
            - generic [ref=e145]:
              - generic [ref=e146]: "0"
              - text: Docentes
          - generic [ref=e147]:
            - img [ref=e149]
            - generic [ref=e151]:
              - generic [ref=e152]: "0"
              - text: Aulas
          - generic [ref=e153]:
            - img [ref=e155]
            - generic [ref=e157]:
              - generic [ref=e158]: "0"
              - text: Generaciones
        - generic [ref=e159]:
          - generic [ref=e160]:
            - generic [ref=e161]:
              - heading "Horario generado" [level=3] [ref=e162]
              - button "Ver todos" [ref=e163] [cursor=pointer]:
                - text: Ver todos
                - img [ref=e164]
            - paragraph [ref=e166]: No hay horarios generados aún.
          - generic [ref=e167]:
            - generic [ref=e168]:
              - heading "Notificaciones recientes" [level=3] [ref=e169]
              - button "Ver todas" [ref=e170] [cursor=pointer]:
                - text: Ver todas
                - img [ref=e171]
            - paragraph [ref=e174]: Sin notificaciones.
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
  17 |     await expect(page.locator('.login-error')).toBeVisible({ timeout: 5000 });
  18 |   });
  19 | 
  20 |   test('Unhappy Path: Login con email vacío', async ({ page }) => {
  21 |     await page.goto('/login');
  22 |     await page.fill('#password', 'admin123');
  23 |     await page.click('button[type="submit"]');
  24 |     const emailInput = page.locator('#email');
  25 |     const validationMessage = await emailInput.evaluate(el => el.validationMessage);
> 26 |     expect(validationMessage).not.toBe('');
     |                                   ^ Error: expect(received).not.toBe(expected) // Object.is equality
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