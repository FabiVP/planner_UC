# UniScheduler 📅

**Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible**

> Proyecto de Fin de Asignatura (PFA) — Taller de Proyectos 2  
> Ingeniería de Sistemas e Informática — Universidad Continental  
> Versión actual: ![version](https://img.shields.io/badge/version-v0.1.0-blue)

---

## Tabla de contenido

- [Integrantes del equipo](#integrantes-del-equipo)
- [Problemática abordada](#problemática-abordada)
- [Justificación del PMV](#justificación-del-pmv)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Instrucciones de instalación](#instrucciones-de-instalación)
- [Instrucciones de build y despliegue](#instrucciones-de-build-y-despliegue)
- [Video explicativo](#video-explicativo)
- [Documentación](#documentación)

---

## Integrantes del equipo

| Nombre | Rol | GitHub |
|---|---|---|
| [Villaverde Pacheco Fabiola Karina] | Scrum Master / Backend Lead | [@usuario1] |
| [Chavez Apaza Marcos Alberto] | Frontend Lead / UI-UX | [@usuario2] |
| [Baldeon Martinez David ] | Algoritmo CSP / QA Lead | [@usuario3] |

---

## Problemática abordada

Las universidades con currículo flexible enfrentan dificultades significativas en la planificación de horarios académicos debido a la alta variabilidad en la matrícula estudiantil, múltiples restricciones interdependientes (prerrequisitos, créditos, disponibilidad de docentes y aulas) y la ausencia de herramientas especializadas. Este proceso manual genera conflictos de horarios, incumplimiento de restricciones académicas y una elevada carga administrativa para los coordinadores.

---

## Justificación del PMV

UniScheduler desarrolla un **Producto Mínimo Viable** que automatiza la generación de horarios aplicando un **algoritmo de Satisfacción de Restricciones (CSP)** con backtracking y heurística MRV. El PMV permite validar que la solución tecnológica propuesta resuelve el problema central con el menor esfuerzo de desarrollo posible, antes de incorporar funcionalidades avanzadas de optimización.

---

## Tecnologías utilizadas

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React.js | 18+ |
| Backend | Node.js + Express.js | 20+ / 4+ |
| Base de datos | PostgreSQL | 15+ |
| ORM | Prisma | 5+ |
| Autenticación | JWT + bcrypt | — |
| Testing | Jest + Supertest | — |
| Control de versiones | Git (Trunk-Based Development) | — |

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (SPA)                  │
│              React.js — Puerto 5173              │
└─────────────────────┬───────────────────────────┘
                      │ HTTP / REST API
┌─────────────────────▼───────────────────────────┐
│                 BACKEND (API REST)               │
│          Node.js + Express — Puerto 3000         │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Routes    │→ │Controllers│→ │  Services  │  │
│  └─────────────┘  └──────────┘  └─────┬──────┘  │
│                                        │         │
│                               ┌────────▼──────┐  │
│                               │    Prisma ORM │  │
└───────────────────────────────┴────────┬──────┘──┘
                                         │
┌────────────────────────────────────────▼────────┐
│                   PostgreSQL                     │
│         Entidades: cursos, docentes,             │
│         estudiantes, aulas, horarios             │
└─────────────────────────────────────────────────┘
```

---

## Instrucciones de instalación

### Prerrequisitos
- Node.js v20+
- PostgreSQL v15+
- Git

### Backend
```bash
cd backend
npm install
cp .env.example .env   # configurar variables de entorno
npx prisma migrate dev
npm run dev
```

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

También disponible en la **[Wiki del proyecto](../../wiki)** para navegación visual.

---

*Universidad Continental — Taller de Proyectos 2 — 2026*
