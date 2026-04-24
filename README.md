# UniScheduler 📅

**Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible**

**Proyecto:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Institución:** Universidad Continental  
**Versión:** 1.0.0 (PMV) | **Fecha:** Abril 2026  
**Metodología:** Scrum | **Stack:** MERN (MongoDB, Express, React, Node.js)

---

## 📑 Tabla de Contenidos (TOC)

- [Integrantes del equipo](#integrantes-del-equipo)
- [Visión General del Proyecto](#-visión-general-del-proyecto)
- [Problemática abordada](#problemática-abordada)
- [Justificación de Complejidad del Problema](#-justificación-de-la-complejidad-del-problema-requisito-clave)
- [Restricciones del Modelo de Optimización (CSP)](#-restricciones-del-modelo-de-optimización-csp)
- [Requerimientos del Sistema (ARC42 + SMART)](#-requerimientos-del-sistema-arc42--smart)
    - 4.1. Requerimientos Funcionales (RF)
    - 4.2. Requerimientos No Funcionales (RNF)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Arquitectura y Enfoque](#-arquitectura-y-enfoque)
- [Entregables y Cronograma](#-entregables-y-cronograma)
- [Instrucciones de instalación](#instrucciones-de-instalación)
- [Instrucciones de build y despliegue](#instrucciones-de-build-y-despliegue)
- [Video explicativo](#video-explicativo)
- [Documentación](#documentación)

---

## Integrantes del equipo

| Nombre | Rol | GitHub |
|---|---|---|
| Villaverde Pacheco Fabiola Karina | Scrum Master / Backend| https://github.com/FabiVP |
| Chavez Apaza Marcos Alberto | Frontend  / UI-UX | https://github.com/Marcos409 |
| Baldeon Martinez David  | Algoritmo CSP / QA | https://github.com/JinDannyDavid |

---
## 🎯 Visión General del Proyecto

**Declaración FOR:**
> *"PARA coordinadores académicos, estudiantes y docentes de universidades con currículo flexible, QUIENES enfrentan dificultades en la planificación manual de horarios, EL Sistema SGOHA ES una aplicación web SPA con motor CSP QUE genera horarios válidos, libres de conflictos y optimizados. A DIFERENCIA de hojas de cálculo o sistemas rígidos, NUESTRO PRODUCTO ofrece automatización, equidad y visualización interactiva."*

**Propósito:** Reducir el tiempo de planificación de días a minutos, eliminando solapamientos de aulas/docentes/estudiantes y validando automáticamente prerrequisitos y carga crediticia (20-22 créditos).

---

## Problemática abordada

Las universidades con currículo flexible enfrentan dificultades significativas en la planificación de horarios académicos debido a la alta variabilidad en la matrícula estudiantil, múltiples restricciones interdependientes (prerrequisitos, créditos, disponibilidad de docentes y aulas) y la ausencia de herramientas especializadas. Este proceso manual genera conflictos de horarios, incumplimiento de restricciones académicas y una elevada carga administrativa para los coordinadores.

---

## 🔬 Justificación de la Complejidad del Problema (Requisito Clave)

El problema abordado **NO es un sistema CRUD trivial**. Corresponde a un contexto de **alta complejidad algorítmica y de ingeniería** por las siguientes razones técnicas:

1.  **Naturaleza NP-Difícil (Combinatoria Explosiva):**
    - El problema de horarios es equivalente al *Graph Coloring* o *Job-Shop Scheduling*. Para `n` cursos, `m` docentes y `p` aulas, el espacio de búsqueda crece factorialmente.
    - En un escenario de prueba con 50 cursos, las combinaciones posibles superan `10^20`, inviables para fuerza bruta.

2.  **Múltiples Variables Interdependientes con Restricciones Duras y Blandas:**
    - **Variables:** Cursos, estudiantes, docentes, aulas, franjas horarias (lunes a sábado, 3 turnos).
    - **Interdependencias:** Asignar un curso a un docente restringe el aula; los prerrequisitos del estudiante afectan la validez de su matrícula; el cupo del aula impacta qué estudiantes pueden asistir.

3.  **Incertidumbre y Variabilidad (Currículo Flexible):**
    - A diferencia de sistemas rígidos, aquí la matrícula **varía cada semestre**. El sistema no puede precalcular horarios fijos; debe reaccionar a conjuntos de estudiantes con distintos cursos aprobados.
    - Los requerimientos no son estáticos; el docente puede refinar restricciones (ej. "priorizar horarios de la mañana") entre Sprints.

4.  **Optimización Multiobjetivo en Conflicto:**
    - Minimizar el número de días con clases para estudiantes **vs.** Maximizar uso de aulas **vs.** Respetar disponibilidad de docentes.
    - No existe una solución "perfecta", sino **soluciones Pareto-óptimas** que requieren un algoritmo de búsqueda con retroceso (*backtracking*) y heurísticas.

5.  **Validación en Tiempo Real:**
    - El sistema debe validar reglas de negocio complejas (prerrequisitos, créditos, solapamientos) **antes** de generar el horario, lo que exige un motor de inferencia, no simples comprobaciones CRUD.

> **Conclusión:** Se requiere un algoritmo de **Satisfacción de Restricciones (CSP)** con técnicas de *forward checking* y *minimum remaining values (MRV)*, no soluciones basadas en reglas simples o búsqueda secuencial.

---

---

## ⛓️ Restricciones del Modelo de Optimización (CSP)

Estas restricciones condicionan el diseño del motor de horarios. Se clasifican por prioridad para el PMV v1.0.0.

| Prioridad | ID | Restricción (Tipo) | Descripción Formal | Impacto en el CSP |
| :--- | :--- | :--- | :--- | :--- |
| **Alta** | RD-01 | Docente único por franja (Dura) | `∀ c1, c2: if horario(c1) = horario(c2) then docente(c1) ≠ docente(c2)` | Reduce dominio de variables compartidas. |
| **Alta** | RD-02 | Aula única por franja (Dura) | `∀ c1, c2: if horario(c1) = horario(c2) then aula(c1) ≠ aula(c2)` | Genera conflictos de asignación de recursos físicos. |
| **Alta** | RD-03 | Estudiante sin solapamiento (Dura) | `∀ estudiante e, cursos c1, c2 en su matrícula: horario(c1) ≠ horario(c2)` | **Restricción más costosa** (valida por cada estudiante). |
| **Alta** | RD-04 | Límite de créditos (Dura) | `20 ≤ Σ créditos(cursos_matriculados(e)) ≤ 22` | Validación previa al CSP. |
| **Alta** | RD-05 | Prerrequisitos (Dura) | `∀ curso c tomado por e: todos los prerrequisitos de c están aprobados en semestres previos` | Validación previa al CSP. |
| **Media** | RD-06 | Tipo de aula (Dura) | `tipo_aula(curso) = tipo_aula(asignada)` | Similar a restricción unaria. |
| **Baja** | RS-01 | Preferencias de horario (Blanda) | Minimizar conflictos con franjas preferidas por estudiantes/docentes. | Función de costo, no validez. |

**Factores técnicos que condicionan la implementación:**
- **Tiempo de ejecución:** El CSP no debe exceder los 30 segundos para 50 cursos. Se aplicará *backtracking* con **poda MRV** y *Forward Checking*.
- **Memoria:** El grafo de restricciones se almacenará en MongoDB con índices optimizados para consultas de solapamiento.

---
## 📋 Requerimientos del Sistema (ARC42 + SMART)

Basado en ISO/IEC 25010 y estructurado según la vista de requisitos de ARC42.

### 4.1. Requerimientos Funcionales (RF)

| ID | Requerimiento (SMART) | Criterio de Aceptación | Sprint |
| :--- | :--- | :--- | :--- |
| **RF-01** | **Registro de Entidades:** El sistema debe permitir al coordinador dar de alta, modificar y listar estudiantes, docentes, cursos y aulas con sus atributos completos (nombre, créditos, prerrequisitos, disponibilidad, capacidad). | Se crea un curso en <2 segundos y aparece en el listado. | 1 |
| **RF-02** | **Validación de Matrícula:** Dado un estudiante y su selección de cursos, el sistema debe verificar en <1 segundo que el total de créditos esté entre 20 y 22 y que todos los prerrequisitos estén aprobados. | Se rechaza matrícula con 23 créditos mostrando causa específica. | 2 |
| **RF-03** | **Generación CSP:** El sistema debe producir un horario semanal válido (sin violar restricciones RD-01 a RD-05) en ≤30 segundos para un input de 50 cursos. | Se genera JSON con asignación curso->(día, hora, aula). | 3 |
| **RF-04** | **Visualización de Horarios:** El sistema debe mostrar una grilla interactiva (lunes a sábado, turnos mañana/tarde/noche) donde cada celda muestre el curso, docente y aula asignados. | El usuario puede hacer clic en una celda para ver detalles. | 4 |

### 4.2. Requerimientos No Funcionales (RNF) - Basados en ISO 25010

| ID | Atributo de Calidad | Requerimiento (SMART + ARC42) | Métrica | Escenario de Prueba |
| :--- | :--- | :--- | :--- | :--- |
| **RNF-01** | **Rendimiento/Eficiencia** | El motor CSP generará un horario para 100 estudiantes y 30 cursos en **< 30 segundos** en un hardware estándar (CPU 2.5 GHz, 8GB RAM). | Tiempo de respuesta (p95) | Se ejecuta prueba de carga con datos de prueba. |
| **RNF-02** | **Seguridad (OWASP)** | La API REST implementará autenticación JWT con expiración en 8 horas. Las contraseñas se almacenarán con bcrypt (costo 10). Todas las rutas `/api/*` requerirán token válido, excepto `/api/login`. | 0 vulnerabilidades críticas en escaneo OWASP ZAP. | Prueba de penetración con tokens inválidos. |
| **RNF-03** | **Usabilidad (WCAG 2.1)** | La interfaz de visualización de horarios cumplirá con **nivel AA**: contraste mínimo 4.5:1, navegación por teclado (TAB, ENTER) y etiquetas ARIA en componentes interactivos. | Certificación automática con axe-core ≥ 90%. | Auditoría con WAVE o Lighthouse. |
| **RNF-04** | **Mantenibilidad (ISO 25010)** | El código backend y frontend tendrá **cobertura de pruebas unitarias ≥ 70%** (Jest para backend, React Testing Library para frontend). | Informe de cobertura (línea/función). | Ejecutar `npm test -- --coverage`. |
| **RNF-05** | **Fiabilidad** | El sistema no presentará errores no controlados (crash) durante la generación de horarios en condiciones normales. Tasa de fallos < 1% en 100 ejecuciones. | Tasa de fallos (crash) | Ejecutar CSP 100 veces con diferentes seeds. |

---
## Tecnologías utilizadas

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React.js | 18+ |
| Backend | Node.js + Express.js | 20+ / 4+ |
| Base de datos | MongoDB |- |
| ORM | Prisma | 5+ |
| Autenticación | JWT + bcrypt | — |
| Testing | Jest + Supertest | — |
| Control de versiones | Git (Trunk-Based Development) | — |

---

## 🏗️ Arquitectura y Enfoque

- **Metodología:** Scrum (Sprints de 2-3 semanas).
- **Arquitectura:** SPA (React) + API REST (Express.js) desacopladas.
- **Patrón de diseño:** MVC en backend, Componentes funcionales + Hooks en frontend.
- **Algoritmo CSP:** *Backtracking* con heurísticas MRV (Minimum Remaining Values) y *Forward Checking*. Modelado como grafo de restricciones.
- **Estándares:** Versionado Semántico, Conventional Commits, Git Flow.

### Diagrama de Arquitectura del Sistema

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USUARIO (Coordinador/Estudiante)                  │
│                                   👤                                        │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                │ HTTPS (GET/POST/PUT/DELETE)
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND - React SPA (Vercel/Localhost)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Login     │  │  Dashboard  │  │ Matrícula   │  │  Horarios   │        │
│  │  Component  │  │  Component  │  │  Component  │  │  Component  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│         └─────────────────┴─────────────────┴─────────────────┘             │
│                                    │                                       │
│                          API Client (Axios)                                │
└────────────────────────────────────│────────────────────────────────────────┘
                                     │
                                     │ JSON (REST API)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BACKEND - Node.js + Express (Render/Localhost)          │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      MIDDLEWARE                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │   JWT    │  │  CORS    │  │ Helmet   │  │ Morgan   │              │  │
│  │  │ Validation│ │          │  │          │  │ (logs)   │              │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      API ROUTES                                       │  │
│  │  /api/auth │ /api/users │ /api/cursos │ /api/matricula │ /api/horarios│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    MOTOR CSP (Núcleo del sistema)                    │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Backtracking + MRV + Forward Checking                         │  │  │
│  │  │  • Ordenamiento dinámico de variables                          │  │  │
│  │  │  • Propagación de restricciones (RD-01 a RD-06)                │  │  │
│  │  │  • Manejo de timeout (30s)                                     │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      MODELOS (Mongoose ODM)                          │  │
│  │  Usuario │ Curso │ Estudiante │ Docente │ Aula │ Matricula │ Horario │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────│────────────────────────────────────────┘
                                     │
                                     │ MongoDB Wire Protocol
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS - MongoDB Atlas (Free Tier)                 │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        COLECCIONES                                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │  │
│  │  │  usuarios  │  │   cursos   │  │estudiantes │  │  docentes  │       │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                        │  │
│  │  │   aulas    │  │ matriculas │  │  horarios  │                        │  │
│  │  └────────────┘  └────────────┘  └────────────┘                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Índices: { "email": 1 }, { "curso_id": 1, "estudiante_id": 1 }              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Entregables y Cronograma

- **Sprint 0 (Sem 1-2):** Documentación base, repositorio, README, Project Charter.
- **Sprint 1 (Sem 3-4):** CRUD de entidades (backend + frontend).
- **Sprint 2 (Sem 5-6):** Módulo de validación de matrícula.
- **Sprint 3 (Sem 7-9):** Motor CSP (implementación y pruebas).
- **Sprint 4 (Sem 10-11):** Visualización de horarios e integración final.
- **Sprint 5 (Sem 12):** Pruebas de sistema, documentación final, video demo.

---

## Instrucciones de instalación

### Prerrequisitos
- Node.js v20+
- MongoDB
- Git

---
### Backend
```bash
cd backend
npm install
cp .env.example .env   # configurar variables de entorno
npx prisma migrate dev
npm run dev
```
---
### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Instrucciones de build y despliegue

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

> Instrucciones detalladas de despliegue en producción: [`docs/ejecucion/despliegue.md`](docs/ejecucion/despliegue.md)

---

## Video explicativo

> 🎬 [Ver video demostrativo](#) *(disponible al finalizar Sprint 7 — v1.0.0)*  
> Duración máxima: 5 minutos

---

## Documentación

Toda la documentación del proyecto está organizada en la carpeta [`docs/`](docs/) siguiendo las áreas de conocimiento del PMBOK:

| Fase | Carpeta | Estado |
|---|---|---|
| Inicio | [`docs/inicio/`](docs/inicio/) | ✅ Sprint 0 |
| Planificación | [`docs/planificacion/`](docs/planificacion/) | 🔄 Sprint 1 |
| Ejecución | [`docs/ejecucion/`](docs/ejecucion/) | ⏳ Pendiente |
| Seguimiento y Control | [`docs/seguimiento_control/`](docs/seguimiento_control/) | ⏳ Pendiente |
| Cierre | [`docs/cierre/`](docs/cierre/) | ⏳ Pendiente |

También disponible en la **[Wiki del proyecto](https://github.com/FabiVP/planner_UC/wiki)** para navegación visual.

---

*Universidad Continental — Taller de Proyectos 2 — 2026*
