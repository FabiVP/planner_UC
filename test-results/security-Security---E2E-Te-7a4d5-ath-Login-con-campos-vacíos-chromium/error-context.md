# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.js >> Security - E2E Tests >> Unhappy Path: Login con campos vacíos
- Location: e2e\security.spec.js:46:3

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
        - button "1" [ref=e116] [cursor=pointer]:
          - img [ref=e117]
          - generic [ref=e119]: "1"
        - button "Cerrar sesión" [ref=e121] [cursor=pointer]:
          - img [ref=e122]
    - main [ref=e124]:
      - generic [ref=e125]:
        - generic [ref=e126]:
          - generic [ref=e127]:
            - heading "¡Hola, Carlos!" [level=1] [ref=e128]
            - paragraph [ref=e129]: Bienvenido a UniScheduler · Coordinador
          - button "Generar horario" [ref=e130] [cursor=pointer]:
            - img [ref=e131]
            - text: Generar horario
        - generic [ref=e133]:
          - generic [ref=e134]:
            - img [ref=e136]
            - generic [ref=e140]:
              - generic [ref=e141]: "0"
              - text: Asignaturas
          - generic [ref=e142]:
            - img [ref=e144]
            - generic [ref=e146]:
              - generic [ref=e147]: "0"
              - text: Docentes
          - generic [ref=e148]:
            - img [ref=e150]
            - generic [ref=e152]:
              - generic [ref=e153]: "0"
              - text: Aulas
          - generic [ref=e154]:
            - img [ref=e156]
            - generic [ref=e158]:
              - generic [ref=e159]: "0"
              - text: Generaciones
        - generic [ref=e160]:
          - generic [ref=e161]:
            - heading "Resumen Docente — Preparación para horarios" [level=3] [ref=e162]
            - button "Ver docentes" [ref=e163] [cursor=pointer]:
              - text: Ver docentes
              - img [ref=e164]
          - generic [ref=e166]:
            - generic [ref=e170]:
              - generic [ref=e171]: "38"
              - generic [ref=e172]: Tiempo Completo
              - generic [ref=e173]: ≤ 40h/sem
            - generic [ref=e177]:
              - generic [ref=e178]: "25"
              - generic [ref=e179]: Por Horas
              - generic [ref=e180]: ≤ 20h/sem
            - generic [ref=e181]:
              - generic [ref=e182]: "63 docentes · Cobertura: 76% de cursos"
              - generic [ref=e183]: "Capacidad: ~2020h semanales"
          - generic [ref=e184]:
            - generic [ref=e185]:
              - img [ref=e186]
              - text: 10 docente(s) sin disponibilidad configurada
            - generic [ref=e188]:
              - img [ref=e189]
              - text: 1 docente(s) sin especialidades asignadas
            - generic [ref=e191]:
              - img [ref=e192]
              - text: 19 curso(s) sin docente especializado
        - generic [ref=e194]:
          - generic [ref=e195]:
            - generic [ref=e196]:
              - heading "Horario generado" [level=3] [ref=e197]
              - button "Ver todos" [ref=e198] [cursor=pointer]:
                - text: Ver todos
                - img [ref=e199]
            - generic [ref=e201]:
              - generic [ref=e202]:
                - img [ref=e203]
                - generic [ref=e206]: "83.6"
              - generic [ref=e207]:
                - paragraph [ref=e208]:
                  - strong [ref=e209]: Horario ISI — 2026-1_final
                - paragraph [ref=e210]: 30/5/2026
                - generic [ref=e211]: Válido
          - generic [ref=e212]:
            - generic [ref=e213]:
              - heading "Notificaciones recientes" [level=3] [ref=e214]
              - button "Ver todas" [ref=e215] [cursor=pointer]:
                - text: Ver todas
                - img [ref=e216]
            - generic [ref=e221]:
              - strong [ref=e222]: Generación completada
              - paragraph [ref=e223]: "La generación de horarios para el semestre 2026-1 se completó exitosamente. Puntaje: 92/100"
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
  43 |     await expect(page.locator('.login-error')).toBeVisible({ timeout: 5000 });
  44 |   });
  45 | 
  46 |   test('Unhappy Path: Login con campos vacíos', async ({ page }) => {
  47 |     await page.goto('/login');
  48 |     await page.click('button[type="submit"]');
  49 |     const emailInput = page.locator('#email');
  50 |     const validationMessage = await emailInput.evaluate(el => el.validationMessage);
> 51 |     expect(validationMessage).not.toBe('');
     |                                   ^ Error: expect(received).not.toBe(expected) // Object.is equality
  52 |   });
  53 | });
  54 | 
```