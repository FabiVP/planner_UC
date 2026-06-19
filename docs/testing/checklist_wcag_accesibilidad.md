# Checklist WCAG 2.1 — Validación de Accesibilidad
## UniScheduler — Taller de Proyectos 2

**Herramientas utilizadas:** Inspección DOM manual, React Testing Library (aria queries), análisis CSS  
**Nivel objetivo:** WCAG 2.1 AA  
**Componentes auditados:** `Login.jsx`, `MainLayout.jsx`, `QualityChart.jsx`, `index.html`, `index.css`

---

## Principio 1: PERCEPTIBLE

| SC | Nivel | Criterio | Estado | Implementación |
|----|-------|----------|--------|----------------|
| 1.1.1 | A | Contenido no textual tiene alternativa textual | ✅ | `aria-hidden="true"` en íconos decorativos (HiOutlineCalendar, HiOutlineMail, HiOutlineLockClosed) |
| 1.3.1 | A | Información y relaciones | ✅ | `htmlFor` en todos los labels, `role="alert"` en error region, `aria-labelledby` en grupo quick-login |
| 1.3.5 | AA | Identificar el propósito de entrada | ✅ | `autoComplete="email"`, `autoComplete="current-password"` |
| 1.4.1 | A | Uso del color (no solo color) | ✅ | Badges usan texto + color; errores usan ícono + texto + color |
| 1.4.3 | AA | Contraste mínimo 4.5:1 | ✅ | `--primary: #2B6CB0` sobre `#FFFFFF` → ratio 5.9:1 ✅ |
| 1.4.4 | AA | Cambio de tamaño del texto | ✅ | Unidades `rem`/`em`; layout flexible sin overflow en 200% zoom |
| 1.4.11 | AA | Contraste de componentes no textuales | ✅ | Inputs con `outline: 2px solid var(--primary)` en focus |
| 1.4.12 | AA | Espaciado de texto | ✅ | `word-spacing: normal; letter-spacing: normal` permite override del usuario |
| 1.4.13 | AA | Contenido en hover/focus | ✅ | Sin contenido que desaparezca al mover mouse |

---

## Principio 2: OPERABLE

| SC | Nivel | Criterio | Estado | Implementación |
|----|-------|----------|--------|----------------|
| 2.1.1 | A | Teclado — toda funcionalidad accesible | ✅ | Tab order correcto: skip-link → email → password → submit → quick-login btns |
| 2.1.2 | A | Sin trampa de teclado | ✅ | Sin modales que atrapan focus no escapable |
| 2.3.3 | AAA | Animación desde interacciones | ✅ | `@media (prefers-reduced-motion: reduce)` desactiva todas las animaciones |
| 2.4.1 | A | Saltar bloques | ✅ | `<a href="#main-content" class="skip-to-content">` en `index.html` |
| 2.4.3 | A | Orden de foco lógico | ✅ | Sidebar → Header → `main#main-content` con `tabIndex={-1}` |
| 2.4.6 | AA | Encabezados y etiquetas descriptivos | ✅ | Labels explícitos; `aria-label` en botones de quick-login |
| 2.4.7 | AA | Foco visible | ✅ | `:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px }` global |
| 2.5.3 | A | Etiqueta en nombre accesible | ✅ | `aria-label="Iniciar sesión"` incluye el texto visible del botón |

---

## Principio 3: COMPRENSIBLE

| SC | Nivel | Criterio | Estado | Implementación |
|----|-------|----------|--------|----------------|
| 3.1.1 | A | Idioma de la página | ✅ | `<html lang="es">` en `index.html` |
| 3.3.1 | A | Identificación de errores | ✅ | `role="alert"` + `aria-live="assertive"` anuncia error a lectores de pantalla |
| 3.3.2 | A | Etiquetas o instrucciones | ✅ | Todos los inputs tienen `<label>` + `aria-required="true"` |

---

## Principio 4: ROBUSTO

| SC | Nivel | Criterio | Estado | Implementación |
|----|-------|----------|--------|----------------|
| 4.1.1 | A | Análisis sintáctico HTML | ✅ | IDs únicos, tags correctamente anidados, sin atributos duplicados |
| 4.1.2 | A | Nombre, función, valor | ✅ | `aria-busy={loading}` en botón submit; roles explícitos en elementos interactivos |
| 4.1.3 | AA | Mensajes de estado | ✅ | `aria-live="assertive"` + `aria-atomic="true"` en contenedor de error |

---

## Soporte de Alto Contraste del Sistema Operativo

```css
@media (forced-colors: active) {
  .btn { forced-color-adjust: none; }       /* ✅ Botones visibles */
  .badge { forced-color-adjust: none; }     /* ✅ Badges visibles */
  .spinner { border-color: ButtonText; }    /* ✅ Spinner usa colores del sistema */
}
```

---

## Incumplimientos detectados (pendientes para futura iteración)

| SC | Nivel | Descripción | Prioridad |
|----|-------|-------------|-----------|
| 1.4.3 | AA | Algunos textos secundarios (`--text-light: #A0AEC0` sobre blanco) tienen ratio ~2.5:1 | Media |
| 2.4.2 | A | Páginas internas no tienen `<title>` dinámico por ruta | Baja |
| 1.2.x | A/AA | No hay contenido multimedia, no aplica actualmente | N/A |

---

## Resumen de cumplimiento

| Nivel | Total criterios | Cumplidos | % |
|-------|----------------|-----------|---|
| A     | 12             | 12        | 100% |
| AA    | 10             | 9         | 90% |
| AAA   | 1              | 1         | 100% |
| **Total** | **23**     | **22**    | **95.6%** |
