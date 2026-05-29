# Análisis y Validación del Problema - UniScheduler

**Curso:** Taller de Proyectos 2 - ISI  
**Equipo:** UniScheduler  
**Fecha:** 24 de mayo de 2026  
**Repositorio:** https://github.com/FabiVP/planner_UC  

---

## Lista de Verificación - Consigna de Análisis y Validación del Problema

A continuación, se mapea cada punto de la rúbrica de la nueva consigna con la **ubicación exacta** dentro del repositorio `planner_UC`.

---

### 1. Validación de requerimientos funcionales y no funcionales

| Punto de la Rúbrica | Ubicación en el Repositorio | Evidencia |
|---------------------|-----------------------------|------------|
| Validación integral de requerimientos funcionales (RF) | `README.md` → sección "4.1. Requerimientos Funcionales (RF)" | Tabla con RF-01 a RF-04, cada uno con descripción SMART, criterio de aceptación y Sprint asignado. |
| Validación integral de requerimientos no funcionales (RNF) | `README.md` → sección "4.2. Requerimientos No Funcionales (RNF) - Basados en ISO 25010" | Tabla con RNF-01 a RNF-05, incluyendo atributo de calidad, métrica y escenario de prueba. |
| Identificación de restricciones y necesidades del sistema | `README.md` → sección "⛓️ Restricciones del Modelo de Optimización (CSP)" | Tabla con 6 restricciones duras (RD-01 a RD-06) y 1 restricción blanda (RS-01), prioridad, descripción formal e impacto en el CSP. |
| Documentación de evidencias | `docs/antigravity/evidencia.md` | Contiene el detalle de validación de restricciones, pruebas unitarias (12/12 pasadas), cobertura (84.26%) y métricas de rendimiento (0.597s). |
| Coherencia entre análisis y problemática planteada | `README.md` → sección "Problemática abordada" y "Justificación de la Complejidad del Problema" | Se describe el problema real (currículo flexible, conflictos de horarios) y se justifica por qué es NP-Difícil, no trivial. |

---

### 2. Identificación del proceso mayor donde se aplica la optimización

| Punto de la Rúbrica | Ubicación en el Repositorio | Evidencia |
|---------------------|-----------------------------|------------|
| Explicación clara del proceso mayor | `README.md` → sección "🎯 Visión General del Proyecto" (Declaración FOR) | "PARA coordinadores académicos, estudiantes y docentes... EL Sistema SGOHA ES una aplicación web SPA con motor CSP QUE genera horarios válidos..." |
| Relación entre optimización y planificación académica | `README.md` → sección "Problemática abordada" + "Justificación de la Complejidad" | Explica cómo la optimización reduce el tiempo de planificación de días a minutos, eliminando solapamientos y validando prerrequisitos. |
| Impacto en la toma de decisiones | `README.md` → sección "Visión General del Proyecto" (Propósito) | "Reducir el tiempo de planificación de días a minutos, eliminando solapamientos... y validando automáticamente prerrequisitos y carga crediticia (20-22 créditos)." |
| Justificación técnica mediante ejemplos o métricas | `docs/antigravity/evidencia.md` → sección "Métricas de rendimiento" | Tabla con resultados concretos: tiempo de generación 0.597s, calidad del horario 89%, cobertura 84.26%. |

---

### 3. Identificación de indicadores clave de éxito de la optimización

| Punto de la Rúbrica | Ubicación en el Repositorio | Evidencia |
|---------------------|-----------------------------|------------|
| Indicadores claros, medibles y relevantes | `README.md` → sección "4.2. Requerimientos No Funcionales (RNF)" | Cada RNF incluye una métrica cuantificable (ej. RNF-01: tiempo de respuesta p95 <30s). |
| Métricas cuantitativas verificables | `docs/antigravity/evidencia.md` → sección "Métricas de rendimiento" | Tabla con 4 métricas: Tiempo de generación (0.597s), Calidad del horario (89%), Cobertura de pruebas (84.26%), Pruebas exitosas (12/12). |
| Criterios de evaluación técnicamente sustentados | `README.md` → sección "4.2. RNFs" (columna "Escenario de Prueba") | Cada métrica tiene un escenario específico (ej. RNF-01: "Se ejecuta prueba de carga con datos de prueba"). |

---

### 4. Identificación de la finalidad de la GUI

| Punto de la Rúbrica | Ubicación en el Repositorio | Evidencia |
|---------------------|-----------------------------|------------|
| Definición clara de la finalidad de la GUI | `README.md` → sección "Visión General del Proyecto" + RF-04 | "visualización interactiva", "grilla interactiva (lunes a sábado, turnos mañana/tarde/noche)". |
| Justificación de decisiones de interfaz | `README.md` → sección "🏗️ Arquitectura y Enfoque" + RF-04 | Arquitectura SPA con React, componentes funcionales, y criterio de aceptación: "El usuario puede hacer clic en una celda para ver detalles". |
| Relación entre GUI, experiencia de usuario y requerimientos | `README.md` → sección "4.2. RNFs" (RNF-03 Usabilidad) | Exige cumplimiento WCAG 2.1 nivel AA, contraste mínimo 4.5:1, navegación por teclado y etiquetas ARIA. |

---

### 5. Actualización de documentación versionada

| Punto de la Rúbrica | Ubicación en el Repositorio | Evidencia |
|---------------------|-----------------------------|------------|
| Documentación actualizada preservando versiones anteriores | `docs/planificacion/` + `docs/antigravity/` + historial de commits | Los archivos muestran fechas de modificación (ej. `inspeccion02.md` del 01/05/2026, commits del 25/05/2026). |
| Trazabilidad de cambios | Historial de commits en GitHub (https://github.com/FabiVP/planner_UC/commits/main/) | 34 commits con mensajes descriptivos (ej. "actualización de los perfiles tanto frontend como backend" del 25/05/2026). |
| Mejora en la organización documental | `README.md` → sección "Documentación" + estructura `docs/` por fases PMBOK | Tabla con carpetas: Inicio, Planificación, Ejecución, Seguimiento y Control, Cierre. |

---

### 6. Actualización del repositorio y TOC

| Punto de la Rúbrica | Ubicación en el Repositorio | Evidencia |
|---------------------|-----------------------------|------------|
| Repositorio actualizado correctamente | Página principal de GitHub (https://github.com/FabiVP/planner_UC) | Último commit: 25 de mayo de 2026. |
| TOC sincronizado | `README.md` → sección "📑 Tabla de Contenidos (TOC)" | El TOC incluye todos los temas principales: Integrantes, Visión, Problemática, Restricciones, Requerimientos, Tecnologías, Arquitectura, Entregables, Instalación, Build, Video, Documentación. |
| Commits organizados | Historial de commits: https://github.com/FabiVP/planner_UC/commits/main/ | Commits con mensajes claros y fechas recientes (Abril-Mayo 2026). |
| Evidencias completas de trabajo colaborativo | `README.md` → sección "Integrantes del equipo" + `inspeccion02.md` | Roles definidos (Scrum Master, Frontend, Algoritmo) y artefactos de gestión (Jira, métricas ágiles). |

---

### 7. Actualización del MVP

| Punto de la Rúbrica | Ubicación en el Repositorio | Evidencia |
|---------------------|-----------------------------|------------|
| MVP actualizado funcionalmente | Código fuente en `backend/` y `frontend/` + Demo en video | El repositorio contiene el código completo. El video demostrativo (enlace en `inspeccion02.md`) muestra el funcionamiento. |
| Integración de información recopilada | `README.md` (actualizado) + `docs/antigravity/evidencia.md` | El README incorpora la justificación de complejidad, restricciones CSP y requisitos SMART. |
| Mejoras verificables | `docs/antigravity/evidencia.md` → sección "Métricas de rendimiento" | Tabla que compara requisito vs resultado (ej. tiempo <30s → 0.597s). |
| Publicación correcta en el repositorio | https://github.com/FabiVP/planner_UC | El repositorio es público y accesible. |

---

## Resumen de Cumplimiento por Criterio

| Criterio de la Rúbrica | Estado | Ubicación Principal |
|------------------------|--------|---------------------|
| Validación de requerimientos funcionales y no funcionales | ✅ Completo | `README.md` (secciones RF y RNF) |
| Identificación del proceso mayor de optimización | ✅ Completo | `README.md` (Visión General + Problemática) |
| Indicadores clave de éxito y métricas | ✅ Completo | `docs/antigravity/evidencia.md` (tabla de métricas) |
| Finalidad de la GUI | ✅ Completo | `README.md` (RF-04 + RNF-03) |
| Actualización de documentación versionada | ✅ Completo | `docs/planificacion/` + historial de commits |
| Actualización del repositorio y TOC | ✅ Completo | `README.md` (TOC) + página principal |
| Actualización del MVP | ✅ Completo | `backend/` + `frontend/` + video demostrativo |

---

## Enlace al Video Demostrativo

**URL del video:** [INSERTAR AQUÍ EL ENLACE DE ONEDRIVE O GOOGLE DRIVE]

**Contenido del video:**
- Presentación del prototipo UniScheduler
- Demostración del registro de entidades (cursos, docentes, aulas)
- Demostración de validación de matrícula (prerrequisitos y rango de créditos)
- Demostración del motor CSP generando horario en <1 segundo
- Visualización de horarios en grilla interactiva
- Cierre con logros alcanzados (0.597s, 84.26% cobertura)

---

## Declaración de Cumplimiento

Por medio del presente, declaramos que:

1. Se ha revisado la **Consigna de Análisis y Validación del Problema** y su rúbrica.
2. El repositorio ha sido actualizado con todos los artefactos solicitados.
3. La tabla anterior especifica claramente la relación de cada punto de la rúbrica con los artefactos del repositorio.
4. El video demostrativo cumple con la duración solicitada (4-5 minutos) y muestra el prototipo funcionando.

**Fecha:** 24 de mayo de 2026

**Firmas:**

| Integrante | Rol | Firma |
|------------|-----|-------|
| Villaverde Pacheco Fabiola Karina | Scrum Master / Backend | |
| Chavez Apaza Marcos Alberto | Frontend / UI-UX | |
| Baldeon Martinez David | Algoritmo CSP / QA | |
