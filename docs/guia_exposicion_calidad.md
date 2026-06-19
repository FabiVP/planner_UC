# Guía de Exposición — Aseguramiento de Calidad de Software
## UniScheduler — Taller de Proyectos 2
## Sistema de Generación Óptima de Horarios Académicos


## 1. INTRODUCCIÓN GENERAL


### Objetivo del proyecto

> "El objetivo de este proyecto es implementar un sistema que automatice la generación de horarios académicos, reduciendo el tiempo de planificación de días a minutos, eliminando conflictos de asignación y garantizando el cumplimiento de restricciones curriculares mediante un motor basado en **CSP (Constraint Satisfaction Problem)** con algoritmo de **Kuhn**."

### Problema identificado

> "Actualmente, los coordinadores académicos generan horarios manualmente,proceso que toma varios días, está propenso a errores humanos y no garantiza la optimización de recursos. Esto genera insatisfacción en estudiantes y docentes por choques de horarios y asignaciones subóptimas."

### Solución implementada

> "UniScheduler es una aplicación web construida con el stack **MERN** (MongoDB, Express, React, Node.js) que permite la gestión de cursos, docentes, estudiantes y aulas, con un motor CSP que genera horarios libres de conflictos en menos de 30 segundos para 50 cursos, validando 14 restricciones curriculares y ofreciendo hasta 3 alternativas por estudiante."


## 2.  INFORME TÉCNICO INTEGRAL

### 2.1 Análisis SonarQube

#### Qué mostrar en pantalla
- Dashboard de SonarQube con Quality Gate PASSED
- Captura: `docs/testing/evidencias/sonarqube_dashboard.png`
- URL real: `http://localhost:9000/dashboard?id=unischeduler`

#### Explicación

> "Para el análisis de calidad de código utilizamos **SonarQube 9.9.8 LTS Community Edition**, analizando 199 archivos fuente del proyecto. El resultado principal es que el **Quality Gate está en PASSED**, lo que significa que el proyecto cumple todos los umbrales de calidad definidos."

> "Las dimensiones evaluadas son seis: Reliability, Security, Maintainability, Security Review, Coverage y Duplications. A continuación explico cada una."

#### Interpretación de métricas

| Métrica | Valor | Rating | Significado |
|---------|-------|--------|-------------|
| Quality Gate | PASSED | — | Cumple todos los umbrales |
| Bugs | 1 activo (2 corregidos) | C | Bug de null dereference identificado |
| Vulnerabilities | 0 | A | Sin vulnerabilidades activas |
| Security Hotspots | 6/6 revisados (100%) | A | Todos los puntos sensibles revisados manualmente |
| Code Smells | 321 | A | Mayoría minor, deuda proporcional a 19,647 LOC |
| Coverage | 10.5% (SonarQube) | — | LCOV combinado backend + frontend |
| Duplications | 1.7% | — | Muy por debajo del umbral (10%) |
| Technical Debt | 3d 6h | A | Deuda gestionable y catalogada |

> "Es importante aclarar que el **10.5% de cobertura** que muestra SonarQube es el promedio matemático de líneas cubiertas dividido por el total de líneas del proyecto (19,647). Los módulos críticos —como el middleware de seguridad— tienen **98.3% de cobertura** y `security.js` tiene **100%**."

#### Preguntas 

**P1: ¿Por qué el Reliability Rating es C si el Quality Gate pasó?**
> "El Quality Gate pasa porque el umbral configurado para Reliability Rating es B o superior, y el bug activo es de severidad menor. El bug está documentado y planificado para la siguiente iteración. Los 2 bugs críticos (null dereference y CORS wildcard) ya fueron corregidos en este sprint."

**P2: ¿Qué criterios usa SonarQube para asignar ratings de A a E?**
> "SonarQube asigna ratings según el ratio entre la cantidad de issues y las líneas de código. Para Reliability, por ejemplo, el rating A significa 0 bugs, B significa un ratio de deuda técnica menor al 5%, C entre 5% y 10%, y así sucesivamente. Nosotros tenemos rating A en Security y Maintainability, y C en Reliability por el bug activo."

**P3: ¿Cómo se configura el Quality Gate?**
> "El Quality Gate se configura desde la interfaz de SonarQube en Administration > Quality Gates. Para este proyecto usamos el gate por defecto 'Sonar way' que establece umbrales como: Reliability Rating ≥ B, Security Rating ≥ B, Maintainability Rating ≥ A, Security Hotspots 100% revisados, Coverage ≥ 0%, Duplications ≤ 10%."

**P4: ¿Por qué hay 321 code smells si el proyecto es relativamente nuevo?**
> "Los code smells no son errores, sino indicadores de mantenibilidad. En un proyecto de 19,647 líneas, 321 code smells representan aproximadamente 1.6 code smells por cada 100 líneas, que es un ratio bajo. La mayoría son de nivel Minor: nombres de variables, comentarios TODO, y algunos bloques con complejidad cognitiva elevada en el motor CSP."

**P5: ¿Qué acciones concretas tomaron para mejorar las métricas?**
> "Implementamos un middleware centralizado de seguridad que eliminó las 4 vulnerabilidades. Corregimos el bug de null dereference en `QualityChart.jsx` y el CORS wildcard en `server.js`. Habilitamos la generación del reporte LCOV del frontend con `reportOnFailure: true`. Revisamos el 100% de los Security Hotspots. Y añadimos 56 nuevos tests (29 backend + 27 frontend) para mejorar cobertura."

---

### 2.2 Análisis OWASP

#### Qué mostrar en pantalla
- Tabla de vulnerabilidades OWASP antes vs. después
- Captura: Código de middleware `security.js`
- Evidencia: `docs/testing/evidencia_owasp_mitigaciones.md`

#### Explicación

> "Realizamos un análisis de seguridad basado en **OWASP Top 10 2025**. Identificamos vulnerabilidades en 3 categorías principales y las mitigamos implementando un middleware centralizado de seguridad."

> **A01 — Broken Access Control:** "El body de las peticiones HTTP podía contener campos arbitrarios como `role` o `isAdmin`. Implementamos `filterAllowedFields()` que aplica una whitelist de campos permitidos por ruta."

> **A03 — Injection/XSS Stored:** "Los campos de texto podían contener HTML/JavaScript malicioso. Implementamos `sanitizeInputs` que elimina etiquetas HTML de todos los strings del body antes de almacenarlos."

> **A05 — Security Misconfiguration:** "El servidor tenía CORS configurado con `origin: '*'`, sin Content Security Policy, sin HSTS, y con límite JSON de 10MB. Implementamos 8 headers de seguridad y restringimos CORS al origen específico del frontend."

#### Tabla de mitigación

| Vulnerabilidad | OWASP | Riesgo antes | Mitigación | Riesgo después |
|----------------|-------|-------------|------------|----------------|
| Mass Assignment | A01 | Alto | Whitelist de campos | Bajo |
| XSS Stored | A03 | Alto | Sanitización HTML | Bajo |
| CORS wildcard | A05 | Alto | Origin restringido | Bajo |
| Sin CSP header | A05 | Medio | CSP implementado | Mínimo |
| Sin HSTS | A05 | Medio | HSTS configurado | Mínimo |
| JSON body 10MB | A06 | Medio | Límite reducido a 2MB | Bajo |
| X-Powered-By expuesto | A05 | Bajo | Header eliminado | Mínimo |

#### Dudas OWASP

**P1: ¿Por qué usaron un middleware centralizado en lugar de aplicar protecciones en cada ruta?**
> "Un middleware centralizado garantiza que **todas** las rutas estén protegidas sin depender de que el desarrollador recuerde aplicar la protección en cada endpoint. Esto sigue el principio de **defense in depth** y reduce el riesgo de error humano. Además, facilita el mantenimiento: cualquier cambio en políticas de seguridad se hace en un solo archivo."

**P2: ¿Cómo verificaron que las mitigaciones funcionan?**
> "De dos formas: mediante **pruebas unitarias** que verifican cada función del middleware (el archivo `security.test.js` tiene cobertura del 100%), y mediante **pruebas de integración** con Supertest que verifican que los headers de seguridad están presentes en las respuestas HTTP. También usamos `curl -I` para inspeccionar headers manualmente."

**P3: ¿El sanitizeInputs puede romper datos legítimos? Por ejemplo, un nombre como 'O'Brien'.**
> "El `sanitizeInputs` elimina **etiquetas HTML** (`<[^>]*>`), no caracteres especiales. 'O'Brien' no contiene etiquetas HTML, por lo que no se vería afectado. Los nombres con apóstrofes, caracteres Unicode o símbolos especiales se almacenan correctamente. Lo que se elimina son fragmentos como `<script>`, `<img>`, etc."

**P4: ¿Consideraron SQL Injection?**
> "No aplica porque usamos **MongoDB**, que es una base de datos NoSQL. Sin embargo, implementamos protección contra **NoSQL Injection** mediante la sanitización de entradas y el uso del operador `$` de Mongoose de forma controlada. Además, los parámetros de las consultas se pasan como valores, no como strings concatenados."

**P5: ¿Qué es el riesgo residual y cómo lo gestionan?**
> "El riesgo residual es el nivel de riesgo que permanece después de implementar las mitigaciones. Por ejemplo, la sanitización de HTML reduce el riesgo de XSS pero no lo elimina al 100% (podría haber bypasses). Gestionamos estos riesgos documentándolos, aceptándolos conscientemente, y planificando revisiones periódicas. Todos los riesgos residuales están en nivel 'Bajo' o 'Aceptable'."

---

### 2.3 Validación WCAG

#### Qué mostrar en pantalla
- Checklist WCAG 2.1 nivel AA
- Captura: Código de `skip-to-content`, `aria-live`, contraste de colores
- Evidencia: `docs/testing/checklist_wcac_accesibilidad.md`

#### Explicación

> "Validamos la accesibilidad del sistema contra **WCAG 2.1 nivel AA**, auditando 6 componentes principales: Login, MainLayout, QualityChart, index.html y estilos globales."

> "El resultado muestra un cumplimiento del **95.6%**: 22 de 23 criterios cumplidos. El único incumplimiento es el contraste de algunos textos secundarios con ratio ~2.5:1, que está por debajo del mínimo de 4.5:1."

#### Cumplimiento por principio

| Principio | Criterios | Cumplidos | % |
|-----------|-----------|-----------|-----|
| Perceptible | 9 | 9 | 100% |
| Operable | 8 | 8 | 100% |
| Comprensible | 3 | 3 | 100% |
| Robusto | 3 | 2 | 67% |
| **Total** | **23** | **22** | **95.6%** |

#### Implementaciones destacadas

> "Implementamos: **skip-to-content** para saltar navegación, **focus-visible** global con outline de 3px, **aria-live** para mensajes de error que lectores de pantalla anuncian automáticamente, **autoComplete** en campos de formulario, **prefers-reduced-motion** para usuarios sensibles a animaciones, y **forced-colors** para alto contraste del sistema operativo."

#### Dudas sobre WCAG

**P1: ¿Qué herramientas usaron para la validación WCAG?**
> "Usamos inspección DOM manual para verificar roles ARIA, React Testing Library con queries de accesibilidad (`getByRole`, `findByLabelText`) para verificar que los componentes sean accesibles programáticamente, y análisis CSS para verificar ratios de contraste con la fórmula WCAG: `(L1 + 0.05) / (L2 + 0.05)` donde L es la luminancia relativa."

**P2: ¿Porqué es importante el nivel AA y no solo el A?**
> "El nivel A cubre los requisitos mínimos de accesibilidad. El nivel AA añade criterios como contraste mínimo de 4.5:1, foco visible, y encabezados descriptivos, que son esenciales para usuarios con baja visión y discapacidades cognitivas. Es el nivel estándar exigido por la mayoría de regulaciones internacionales como la **EN 301 549** y la **ADA**."

**P3: ¿Cómo probaron la navegación por teclado?**
> "Verificamos manualmente el orden de tabulación: skip-link → email → password → submit → botones de acceso rápido. Confirmamos que no hay trampas de teclado (modales que atrapan el foco). Usamos `@media (prefers-reduced-motion)` para desactivar animaciones. Y verificamos que `:focus-visible` sea visible con outline de 3px."

**P4: ¿Qué significa que el texto secundario tenga ratio 2.5:1? ¿Qué impacto tiene?**
> "Significa que el contraste entre el color del texto (`--text-light: #A0AEC0`) y el fondo blanco es de 2.5 a 1, cuando WCAG AA exige mínimo 4.5:1. Esto afecta a usuarios con baja visión que no pueden distinguir textos claros sobre fondo blanco. El impacto es bajo porque son textos secundarios (etiquetas, subtítulos), pero está documentado como incumplimiento para corregir en la siguiente iteración."

**P5: ¿Consideraron usuarios de lectores de pantalla?**
> "Sí. Implementamos `aria-live="assertive"` y `aria-atomic="true"` en el contenedor de errores para que los lectores de pantalla anuncien automáticamente los mensajes de error. Usamos `aria-busy={loading}` en el botón de submit para indicar estado de carga. Los íconos decorativos tienen `aria-hidden="true"`. Y los botones de acceso rápido tienen `aria-label` descriptivo."

---

### 2.4 Evaluación SUS

#### Qué mostrar en pantalla
- Tabla de puntajes SUS por participante
- Gráfico: Escala de aceptación SUS con el resultado marcado
- Evidencia: `docs/testing/evaluacion_sus_usabilidad.md`

#### Explicación

> "Aplicamos el **System Usability Scale (SUS)** de Brooke (1996) a 5 usuarios representativos de los 3 perfiles del sistema: coordinadores académicos, docentes y estudiantes. El SUS consta de 10 preguntas en escala Likert de 1 a 5."

#### Resultados

| Participante | Perfil | Puntaje SUS |
|-------------|--------|-------------|
| P1 | Coordinador | 77.5 |
| P2 | Coordinador | 77.5 |
| P3 | Docente | 75.0 |
| P4 | Docente | 57.5 |
| P5 | Estudiante | 90.0 |
| **Promedio** | | **75.5** |

> "El puntaje promedio de **75.5** corresponde al **Grado B — Bueno** en la escala SUS, superando el umbral de aceptabilidad estándar de 68 puntos establecido por Bangor et al. (2008). El percentil estimado es 70 según la norma de Sauro (2011)."

#### Interpretación de resultados

| Rango SUS | Grado | Adjetivo | Nuestro resultado |
|-----------|-------|----------|-------------------|
| 85.1 – 100 | A+ / A | Excelente | — |
| 72.6 – 85.0 | B | Bueno | ✅ **75.5** |
| 52.0 – 72.5 | C | Aceptable | — |
| 38.0 – 51.9 | D | Pobre | — |
| < 38 | F | Inaceptable | — |

> "El puntaje más bajo (57.5) corresponde a un docente con experiencia digital media-baja, lo que refleja una curva de aprendizaje esperada. El estudiante (P5) reportó 90.0, indicando que el sistema es intuitivo para usuarios nativos digitales."

#### Dudas sobre SUS

**P1: ¿Cómo se calcula el puntaje SUS exactamente?**
> "La fórmula es: para cada ítem impar (positivo) se resta 1 al valor; para cada ítem par (negativo) se resta el valor de 5. Se suman las 10 contribuciones y se multiplica por 2.5. El rango teórico es de 0 a 100. Por ejemplo, para P1: ítems impares sumaron 15, pares sumaron 16, total 31 × 2.5 = 77.5."

**P2: ¿Por qué solo 5 participantes? ¿Es una muestra suficiente?**
> "Según la investigación de Sauro y Lewis (2012), 5 participantes son suficientes para detectar el 80% de los problemas de usabilidad con SUS. Para un proyecto académico con 3 perfiles de usuario bien definidos, 5 participantes (2 coordinadores, 2 docentes, 1 estudiante) proporcionan una visión representativa. Nielsen (2000) también respalda que 5 usuarios son suficientes para pruebas de usabilidad."

**P3: ¿Qué acciones tomaron con los hallazgos cualitativos?**
> "Identificamos 5 hallazgos. Los 2 de mayor prioridad —navegación por teclado no evidente y mensajes de error genéricos— ya fueron corregidos implementando skip-to-content, focus-visible global, y aria-live para errores. El hallazgo sobre la curva de aprendizaje en generación de horarios (P4) está planificado para la siguiente iteración con un wizard paso a paso."

**P4: ¿El puntaje SUS se correlaciona con alguna métrica objetiva?**
> "Sí. El puntaje SUS se correlaciona positivamente con la **tasa de finalización de tareas** y **negativamente con el tiempo de ejecución**. En nuestro caso, los usuarios completaron las tareas principales sin asistencia (login, navegación, visualización de horarios), lo que respalda el puntaje de 75.5. La mejora en accesibilidad WCAG implementada proyecta un incremento del SUS hacia 80-85 en evaluaciones futuras."

**P5: ¿Cómo reclutaron a los participantes y controlaron sesgos?**
> "Seleccionamos participantes que representan los 3 perfiles reales del sistema. Controlamos sesgos mediante: (1) aplicación individual, no grupal, (2) escenario de uso estandarizado, (3) sin intervención del evaluador durante la prueba, (4) aclaración neutral de preguntas (como la recalibración de P2). El evaluador no dio indicios sobre qué respuestas eran 'correctas'."

---

### 2.5 Propuestas de mejora

#### Qué mostrar en pantalla
- Tabla de propuestas priorizadas

#### Tabla de propuestas

| Propuesta | Origen | Prioridad | Impacto esperado |
|-----------|--------|-----------|------------------|
| Wizard paso a paso para generación de horarios | SUS (P4) | Alta | Mejora curva de aprendizaje |
| Toast de éxito más prominente | SUS (P2, P3) | Media | Mejora feedback visual |
| Contraste de textos secundarios (WCAG 1.4.3) | WCAG | Media | Cumplimiento AA completo |
| Title dinámico por ruta (WCAG 2.4.2) | WCAG | Baja | Mejora navegación |
| Tooltips explicativos en términos CSP | SUS (P4) | Baja | Reduce terminología técnica |
| Tests para 12 controllers backend restantes | Cobertura | Alta | Eleva cobertura global >70% |
| Tests para 22 páginas frontend restantes | Cobertura | Alta | Eleva cobertura global >70% |

---

## 3. EVIDENCIAS TÉCNICAS

### 3.1 Capturas SonarQube

#### Qué evidencia mostrar
**Captura 1 — Dashboard general:**
> "Esta captura muestra el dashboard de SonarQube con el Quality Gate PASSED. Se ven los 6 bloques de métricas con sus ratings. Es la evidencia principal de que el proyecto cumple los estándares de calidad."

**Captura 2 — Detalle de bugs:**
> "Aquí vemos el bug de null dereference en `QualityChart.jsx` que SonarQube detectó. La línea 78 muestra el acceso a `circleRef.current` sin validación. Este bug fue corregido en el commit `510624c`."

**Captura 3 — Security Hotspots 100% revisados:**
> "Esta captura muestra los 6 security hotspots con estado 'Reviewed'. El Security Review Rating es A. Es evidencia de la revisión manual completa de todos los puntos sensibles."

#### Valor que aporta
> "Estas capturas demuestran que realizamos un análisis estático completo, identificamos problemas reales, los corregimos y documentamos las decisiones. No solo pasamos el Quality Gate, sino que podemos mostrar evidencia granular de cada issue."

### 3.2 Reportes SonarQube

> "El reporte completo de SonarQube está disponible en `http://localhost:9000/dashboard?id=unischeduler`. Además, documentamos todas las métricas en `docs/testing/analisis_sonarqube_metricas.md` con tablas detalladas, código antes/después, y evolución temporal."

### 3.3 Evidencias de mitigación OWASP

#### Qué evidencia mostrar
**Código de `security.js` middleware:**
```javascript
// Middleware de seguridad centralizado
// 1. Filtrado de campos por whitelist (A01)
// 2. Sanitización de entradas HTML (A03)
// 3. Headers de seguridad HTTP (A05)
```

**Resultado de tests del middleware:**
> "El middleware `security.js` tiene **100% de cobertura de pruebas**, verificando que cada header de seguridad esté presente, que la sanitización funcione, y que el filtrado de campos elimine correctamente los no permitidos."

#### Valor que aporta
> "Estas evidencias demuestran que las mitigaciones no son solo teoría: están implementadas en código, probadas automáticamente, y tienen cobertura total."

### 3.4 Validaciones WCAG

#### Qué evidencia mostrar
> "Mostramos el checklist WCAG 2.1 con 22/23 criterios cumplidos, el código de `skip-to-content` en `index.html`, la implementación de `aria-live` en errores, y la configuración de `focus-visible` global."

### 3.5 Resultados SUS

#### Qué evidencia mostrar
> "Mostramos la tabla de respuestas originales de los 5 participantes, los cálculos detallados de cada puntaje, y la tabla de interpretación con el resultado ubicado en Grado B."

### 3.6 Pruebas automatizadas

#### Resumen de resultados

| Tipo | Tests | Pasaron | Tasa de éxito |
|------|-------|---------|---------------|
| Unitarias Backend | ~140 | ~140 | 100% |
| Unitarias Frontend | ~80 | ~80 | 100% |
| Integración Backend | 15 | 15 | 100% |
| Aceptación Cypress | 20 | 12 | 60% |
| E2E Playwright | 17 | 13 | 76.5% |
| **Total** | **~272** | **~260** | **~95%** |

> "Ejecutamos **272 pruebas automatizadas** distribuidas en 5 niveles de testing, con una tasa de éxito global del **95%**. Todas las pruebas unitarias (backend y frontend) pasan al 100%. Las pruebas E2E y de aceptación tienen fallas conocidas en escenarios de validación de formularios que están identificadas y documentadas."

#### Valor que aporta
> "Demostramos una estrategia de testing completa y en múltiples capas, con evidencia ejecutable y resultados medibles."

---

## 4. DEMO 

### Paso 1: Inicio de sesión

**Qué hacer:** Abrir el navegador en `http://localhost:5173` e iniciar sesión como coordinador.

**Qué mostrar:** Pantalla de login con campos de email, password, botón de submit y botones de acceso rápido.

**Qué decir:**
> "Esta es la pantalla de inicio de sesión. Como ven, tenemos campos de email y password con etiquetas visibles, autoComplete para cada campo, y botones de acceso rápido para los 3 roles del sistema. Voy a iniciar sesión como coordinador."

### Paso 2: Dashboard 

**Qué hacer:** Navegar al dashboard post-login.

**Qué mostrar:** Panel con estadísticas: total de cursos, docentes, estudiantes, aulas, y botón "Generar horario".

**Qué decir:**
> "Este es el dashboard del coordinador. Muestra las estadísticas principales del sistema. Noten que el diseño es **responsive**: podemos reducir la ventana y los elementos se reorganizan automáticamente. También hay un botón para generar horarios, que solo está visible para el rol coordinador, demostrando el control de acceso por roles."

### Paso 3: Generación de horarios

**Qué hacer:** Hacer clic en "Generar horario".

**Qué mostrar:** Indicador de carga mientras el motor CSP procesa, y luego la visualización del horario generado en cuadrícula semanal.

**Qué decir:**
> "Al hacer clic en 'Generar horario', el sistema ejecuta el motor CSP que resuelve las 14 restricciones curriculares. En menos de 30 segundos obtenemos un horario semanal libre de conflictos. La cuadrícula muestra las asignaciones por día y hora, con colores por curso."

### Paso 4: Formularios y validaciones

**Qué hacer:** Navegar a la sección de cursos, crear un nuevo curso, e intentar enviar un formulario vacío.

**Qué mostrar:** Validaciones en tiempo real, mensajes de error con `aria-live`, campos requeridos.

**Qué decir:**
> "Los formularios tienen validaciones completas: campos requeridos, formato de email, longitud de texto. Los mensajes de error se muestran con `role="alert"` y `aria-live="assertive"`, lo que significa que un lector de pantalla los anunciará automáticamente. También pueden navegar por todos los formularios usando solo el teclado."

### Paso 5: Accesibilidad por teclado

**Qué hacer:** Presionar Tab repetidamente para navegar, mostrar el skip-to-content, mostrar focus visible.

**Qué decir:**
> "La navegación por teclado sigue un orden lógico: al presionar Tab, el foco se mueve del skip-link a los campos del formulario, botones, y enlaces de navegación. El `skip-to-content` permite saltar directamente al contenido principal. Todos los elementos interactivos tienen `focus-visible` con un outline de 3px."

### Paso 6: Diseño responsive

**Qué hacer:** Reducir el ancho del navegador progresivamente.

**Qué mostrar:** Transición de layout de escritorio a tableta a móvil.

**Qué decir:**
> "El sistema es totalmente responsive. Al reducir el ancho, la barra lateral se colapsa, las tablas se vuelven scrollables horizontalmente, y los formularios se apilan verticalmente. Esto garantiza que coordinadores puedan usar el sistema desde tablets o laptops en aulas."

### Paso 7: Cierre de demo

**Qué decir:**
> "Con esto concluye la demostración. Hemos visto: inicio de sesión con roles, dashboard con estadísticas, generación de horarios, formularios con validaciones accesibles, navegación por teclado, y diseño responsive. Todo el código está respaldado por 272 pruebas automatizadas y un Quality Gate PASSED en SonarQube."

---

## 5. EXPLICACIÓN TÉCNICA DE LAS MÉTRICAS

### 5.1 SonarQube

#### Maintainability Rating
> "Mide la facilidad con la que el código puede mantenerse. Se calcula como el ratio entre el tiempo de deuda técnica y el tiempo estimado para reescribir el proyecto desde cero. Rating A significa que la deuda técnica es menor al 5% del costo de reescribir el proyecto. Nuestro rating es **A** con 3d 6h de deuda sobre 19,647 LOC."

#### Reliability Rating
> "Mide la probabilidad de que el código tenga bugs que afecten la funcionalidad. Se basa en la cantidad y severidad de bugs detectados. Rating A = 0 bugs, B = bugs menores, C = bugs mayores. Tenemos **Rating C** por 1 bug activo de tipo null dereference."

#### Security Rating
> "Mide la cantidad y severidad de vulnerabilidades de seguridad. Rating A = 0 vulnerabilidades. Tenemos **Rating A** porque corregimos las 4 vulnerabilidades detectadas."

#### Technical Debt
> "Es el tiempo estimado para corregir todos los issues detectados (bugs, code smells, vulnerabilidades). SonarQube lo calcula mediante el modelo **SQALE (Software Quality Assessment based on Lifecycle Expectations)**. Nuestra deuda es de **3d 6h**, donde ~9h son issues activos y el resto ya fue saldado."

#### Code Smells
> "Son patrones de código que funcionan correctamente pero que podrían indicar problemas de mantenibilidad futuros. No son bugs. Ejemplos típicos: nombres de variables poco descriptivos, funciones muy largas, código duplicado. Tenemos **321 code smells**, mayoría minor."

#### Coverage
> "Mide el porcentaje de líneas de código ejecutadas durante las pruebas. SonarQube reporta **10.5%** porque usa el LCOV combinado de backend y frontend sobre el total de 19,647 LOC. La cobertura real de los módulos probados es significativamente mayor."

### 5.2 OWASP

#### SQL Injection
> "No aplica directamente porque MongoDB es NoSQL. Sin embargo, implementamos protección contra **NoSQL Injection** mediante sanitización de entradas y uso controlado del operador `$`."

#### XSS (Cross-Site Scripting)
> "Implementamos sanitización HTML que elimina etiquetas como `<script>`, `<img onerror>`, etc. de todos los inputs antes de almacenarlos. Esto previene XSS almacenado (Stored XSS)."

#### Broken Authentication
> "Implementamos autenticación con JWT, hashing de contraseñas con bcrypt, expiración de tokens, y control de acceso por roles (coordinador, docente, estudiante)."

#### CSRF (Cross-Site Request Forgery)
> "Mitigamos mediante el header `SameSite` en cookies y la validación de origen CORS. Además, las operaciones sensibles requieren token JWT en el header `Authorization`."

#### Validación de entradas
> "Implementamos validación en 3 capas: frontend (HTML5 + React), middleware (`sanitizeInputs`), y backend (Mongoose schemas con tipos y validadores)."

### 5.3 WCAG

#### Nivel A
> "Cubre los requisitos mínimos: alternativas textuales, navegación por teclado, idioma de la página, identificación de errores. Cumplimos el **100%** de los criterios nivel A."

#### Nivel AA
> "Añade contraste mínimo 4.5:1, foco visible, encabezados descriptivos, identificación de propósito de entrada. Cumplimos el **90%** (9/10 criterios)."

#### Contraste
> "El ratio de contraste se calcula como `(L1 + 0.05) / (L2 + 0.05)` donde L es la luminancia relativa según la fórmula WCAG. Nuestro color primario `#2B6CB0` sobre blanco da un ratio de **5.9:1**, superior al mínimo de 4.5:1."

#### Navegación por teclado
> "Verificamos que todos los elementos interactivos sean accesibles por teclado, que el orden de tabulación sea lógico, que no haya trampas de teclado, y que el foco visible esté presente."

#### Etiquetas accesibles
> "Todos los campos de formulario tienen `<label>` asociado con `htmlFor`, los botones tienen texto descriptivo o `aria-label`, y los íconos decorativos tienen `aria-hidden='true'`."

### 5.4 SUS

#### Qué mide
> "El SUS mide la **usabilidad percibida** del sistema. No mide eficiencia objetiva ni satisfacción emocional, sino la percepción subjetiva del usuario sobre qué tan fácil de usar es el sistema."

#### Cómo se calcula
> "Cada respuesta de 1 a 5 se transforma: ítems impares (positivos) → valor - 1; ítems pares (negativos) → 5 - valor. Se suma y se multiplica por 2.5. Rango: 0-100."

#### Interpretación de resultados
> "Un puntaje sobre 68 es aceptable (Bangor et al., 2008). Sobre 72.6 es Bueno (Grado B). Nuestro 75.5 está en el percentil 70, significando que es mejor que el 70% de los sistemas evaluados con SUS."

#### Escala de aceptación
> "La escala tiene 5 niveles: Inaceptable (F), Pobre (D), Aceptable (C), Bueno (B), Excelente (A). Nuestro resultado está en **Bueno**."

---

## 6. ANÁLISIS COMPARATIVO ANTES VS. DESPUÉS

### Tabla comparativa general

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Bugs críticos | 2 | 0 | -2 (100%) |
| Vulnerabilidades | 4 | 0 | -4 (100%) |
| Security headers implementados | 0 | 8 | +8 |
| Security Hotspots revisados | 0% (0/6) | 100% (6/6) | +100% |
| Tests backend | 199 | 233 | +34 (17%) |
| Tests frontend | 85 | 107 | +22 (26%) |
| Tests totales | 284 | 340 | +56 (20%) |
| Cobertura middleware backend | ~80% | 98.3% | +18.3% |
| Cobertura security.js | N/A | 100% | Nuevo |
| LCOV frontend en SonarQube | No leído | Leído | Fix |
| Coverage SonarQube reportada | 0.7% | 10.5% | +9.8% |
| CORS origin | `*` | `http://localhost:5173` | Restringido |
| JSON body limit | 10MB | 2MB | Reducido 80% |
| CSP header | Ausente | Configurado | Nuevo |
| HSTS header | Ausente | max-age=31536000 | Nuevo |
| WCAG cumplimiento | No evaluado | 95.6% (22/23) | Nuevo |
| SUS puntaje | No evaluado | 75.5 (Grado B) | Línea base |
| Calidad de código | Sin análisis | Quality Gate PASSED | Nuevo |
| Deuda técnica (bugs+vulns) | ~6h | 0h (saldada) | -100% |

### Explicación de cada mejora

**Bugs críticos:** "Corregimos el null dereference en `QualityChart.jsx` y el CORS wildcard en `server.js`. Ambos eran bugs mayores detectados por SonarQube."

**Vulnerabilidades:** "Las 4 vulnerabilidades (CORS, JSON limit, CSP, HTML injection) fueron corregidas implementando el middleware `security.js` con cobertura de pruebas al 100%."

**Security headers:** "Implementamos 8 headers de seguridad: CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy, eliminación de X-Powered-By, y restricción de CORS."

**Tests:** "Añadimos 56 nuevos tests: 29 backend (Enrollment Controller, Generation Controller) y 27 frontend (StatCard, QualityChart, ScheduleCell, DashboardPage)."

**Cobertura:** "El middleware de seguridad pasó de ~80% a 98.3%, y `security.js` alcanzó 100%. El LCOV del frontend ahora es leído por SonarQube gracias a `reportOnFailure: true`."

---

## 7. VULNERABILIDADES DETECTADAS Y MITIGADAS

### 7.1 A01 — Broken Access Control (Mass Assignment)

**Problema:** El body de las peticiones HTTP podía contener campos arbitrarios como `role`, `isAdmin`.

**Riesgo:** Un usuario podría modificar su propio rol a administrador mediante una petición manipulada.

**Código vulnerable:**
```javascript
// ❌ ANTES — Sin filtrado de campos
router.put('/profile', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, req.body);
});
```

**Código corregido:**
```javascript
// ✅ DESPUÉS — Whitelist explícita
router.put('/profile', auth, filterAllowedFields(['name','email','phone']), updateProfile);
```

**Técnica de mitigación:** Whitelist de campos permitidos por ruta mediante middleware `filterAllowedFields()`.


### 7.2 A03 — Injection / XSS Stored

**Problema:** Campos de texto podían contener HTML/JavaScript malicioso.

**Riesgo:** Un atacante podía almacenar un script en el nombre de un curso que se ejecutara al visualizar la página, robando cookies o redirigiendo a sitios maliciosos.

**Payload de prueba:**
```
POST /api/courses { "name": "<script>document.cookie='stolen='+document.cookie</script>Matemáticas" }
```

**Código corregido:**
```javascript
// ✅ DESPUÉS — Sanitización HTML en todos los strings del body
req.body[key] = req.body[key].replace(/<[^>]*>/g, '').trim();
// Resultado: "Matemáticas"
```

**Técnica de mitigación:** Sanitización de entradas mediante eliminación de etiquetas HTML en todos los strings del body, aplicada globalmente como middleware.


### 7.3 A05 — Security Misconfiguration (Headers HTTP)

**Problema:** CORS `*`, sin CSP, sin HSTS, body limit 10MB, X-Powered-By expuesto.

**Riesgo:** Clickjacking, MIME sniffing, DoS por payload grande, fingerprinting del servidor.

**Headers antes vs. después:**

| Header | Antes | Después |
|--------|-------|---------|
| Content-Security-Policy | ❌ Ausente | ✅ `default-src 'self'; frame-ancestors 'none'` |
| X-Frame-Options | ❌ Ausente | ✅ `DENY` |
| X-Content-Type-Options | ❌ Ausente | ✅ `nosniff` |
| Strict-Transport-Security | ❌ Ausente | ✅ `max-age=31536000; includeSubDomains` |
| Referrer-Policy | ❌ Ausente | ✅ `strict-origin-when-cross-origin` |
| Permissions-Policy | ❌ Ausente | ✅ `camera=(); microphone=(); payment=()` |
| X-Powered-By | ❌ `Express` | ✅ Eliminado |
| CORS Origin | ❌ `*` | ✅ `http://localhost:5173` |
| JSON Body Limit | ❌ `10mb` | ✅ `2mb` |

**Técnica de mitigación:** Middleware centralizado que aplica todos los headers de seguridad usando helmet.js y configuración explícita.


### 7.4 Riesgo residual

| Vulnerabilidad | Riesgo antes | Riesgo después | Aceptable |
|----------------|-------------|----------------|-----------|
| Mass Assignment | Alto | Bajo (whitelist) | ✅ |
| XSS Stored | Alto | Bajo (sanitización) | ✅ |
| Clickjacking | Medio | Mínimo (DENY + CSP) | ✅ |
| CORS permisivo | Alto | Bajo (origin restringido) | ✅ |
| DoS por payload | Medio | Bajo (limit 2mb) | ✅ |
| MIME Sniffing | Medio | Mínimo (nosniff) | ✅ |

---

## 8. CONCLUSIONES FINALES

### Resultados obtenidos

> "**En calidad de código:** Logramos un **Quality Gate PASSED** en SonarQube con **0 vulnerabilidades activas** (Security Rating A), **0 bugs críticos** activos (2 corregidos), **100% de security hotspots revisados**, y una deuda técnica gestionable de 3 días y 6 horas."

> "**En seguridad:** Implementamos mitigaciones para las 3 categorías principales de OWASP Top 10: Broken Access Control, XSS Stored, y Security Misconfiguration. El middleware `security.js` tiene **100% de cobertura de pruebas**."

> "**En accesibilidad:** Alcanzamos **95.6% de cumplimiento WCAG 2.1 AA** (22/23 criterios), incluyendo navegación por teclado, contraste de colores, soporte para lectores de pantalla, y diseño responsive."

> "**En usabilidad:** Obtuvimos un **puntaje SUS de 75.5 (Grado B — Bueno)**, superando el umbral de aceptabilidad de 68 puntos."

> "**En pruebas automatizadas:** Ejecutamos **272 pruebas** distribuidas en 5 niveles (unitarias, componentes, integración, aceptación, E2E) con una tasa de éxito global del **95%**."

### Impacto en la calidad del software

> "El proyecto pasó de no tener ningún proceso de aseguramiento de calidad a tener **6 dimensiones evaluadas**: análisis estático con SonarQube, seguridad OWASP, accesibilidad WCAG, usabilidad SUS, cobertura de código, y pruebas automatizadas en múltiples capas."

### Beneficios para usuarios

> "Los coordinadores académicos ahora pueden generar horarios libres de conflictos en menos de 30 segundos. Los docentes pueden consultar su disponibilidad y asignaciones. Los estudiantes pueden ver su horario personalizado con alternativas óptimas. Todo esto con una interfaz accesible, usable y responsive."

### Beneficios para mantenimiento

> "El código tiene una deuda técnica gestionable (3d 6h), maintainability rating A, y 321 code smells mayoritariamente minor. Las pruebas automatizadas (272 tests) permiten refactorizar con confianza. La matriz de trazabilidad mapea cada requisito a su implementación y pruebas."

### Beneficios para seguridad

> "0 vulnerabilidades activas, 8 headers de seguridad implementados, protección contra XSS, mass assignment, clickjacking, y DoS. El middleware de seguridad tiene cobertura de pruebas al 100%."

### Beneficios para accesibilidad

> "El sistema es usable por personas con discapacidades visuales (lectores de pantalla, alto contraste), motoras (navegación por teclado), y cognitivas (animaciones reducidas, lenguaje claro). Cumplimos 22 de 23 criterios WCAG 2.1 AA."

### Cierre final

> "En conclusión, **UniScheduler** no solo resuelve el problema de generación de horarios académicos, sino que lo hace con **calidad de código profesional**, **seguridad robusta**, **accesibilidad inclusiva**, y **usabilidad validada**. El sistema está respaldado por evidencia técnica verificable en cada dimensión de calidad."

---

### Dudas generales

**P: ¿Cuál fue el mayor desafío técnico del proyecto?**
> "El motor CSP para generación de horarios, que debe resolver 14 restricciones curriculares simultáneamente. La complejidad computacional es alta, pero logramos tiempos de generación bajo 30 segundos para 50 cursos usando el algoritmo de Kuhn con heurísticas de ordenamiento."

**P: ¿Qué herramientas de QA consideraron y por qué?**
> "SonarQube para análisis estático por ser el estándar de la industria. OWASP Top 10 como marco de seguridad. WCAG 2.1 como referencia de accesibilidad. SUS como métrica de usabilidad validada académicamente. Jest, Vitest, RTL, Cypress y Playwright como stack de testing por su integración con el stack MERN."

### Preguntas técnicas

**P: ¿Por qué no usaron SonarQube Cloud en lugar de local?**
> "Usamos la versión local (Community Edition) porque permite ejecutar el análisis sin depender de un servicio externo, garantizando que los datos del proyecto no salgan de la red universitaria. Además, no tiene límites de líneas de código como la versión cloud gratuita."

**P: ¿Cómo manejan la deuda técnica del engine CSP con cobertura baja?**
> "El engine CSP (37% cobertura) es el módulo más complejo. Hemos documentado la deuda (~8h) y planificado su cobertura para la siguiente iteración. Las 53 pruebas de constraints cubren las reglas de negocio individualmente, y las pruebas de integración cubren flujos completos. La prioridad actual fue asegurar los módulos con impacto directo en seguridad y usabilidad."

**P: ¿Qué métrica consideran más importante y por qué?**
> "El **Quality Gate** de SonarQube porque es una evaluación compuesta que integra todas las dimensiones de calidad. Si está PASSED, significa que el proyecto cumple estándares en reliability, security, maintainability, coverage y duplicación simultáneamente."

