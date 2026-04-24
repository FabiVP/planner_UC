# Lista Preliminar de Requerimientos

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Universidad:** Universidad Continental  
**Fecha:** Marzo 2026  
**Versión:** 0.1 (preliminar — sujeto a refinamiento en Sprint 1)

---

## 1. Estructura según ARC42 (Sección 3: Requisitos)

Este documento sigue las directrices de **ARC42** para la documentación de arquitectura de software, sección 3 "Requisitos" y aplica criterios **SMART** (Específicos, Medibles, Alcanzables, Relevantes, Temporales) en cada requerimiento.

---

## 2. Requerimientos Funcionales (RF)

| ID | Nombre | Prioridad (MoSCoW) | Requerimiento SMART | Escenario de aceptación | Sprint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| RF-01 | Gestión de entidades | **Must** | El sistema debe permitir al coordinador dar de alta, consultar, modificar y eliminar estudiantes, docentes, cursos y aulas, con todos sus atributos, en **<2 segundos por operación**. | Se crea un curso con 5 campos obligatorios y aparece inmediatamente en el listado paginado. | 1 |
| RF-02 | Validación de prerrequisitos | **Must** | Dado un estudiante con un historial de cursos aprobados, el sistema debe validar en **<500ms** que todos los cursos seleccionados cumplen sus prerrequisitos. | Se rechaza matrícula que incluya "Base de Datos Avanzada" sin haber aprobado "Base de Datos I". | 2 |
| RF-03 | Validación de créditos | **Must** | El sistema debe calcular la suma de créditos de los cursos seleccionados por un estudiante y verificar que esté en el rango **[20, 22] créditos**, mostrando un mensaje claro si está fuera. | Estudiante con matrícula de 23 créditos ve mensaje "Excede el límite de 22 créditos por semestre". | 2 |
| RF-04 | Generación CSP | **Must** | El motor debe producir un horario **sin conflictos** (0 solapamientos de docentes, aulas y estudiantes) para un conjunto de 50 cursos y 100 estudiantes en **≤30 segundos**. | Se ejecuta con datos de prueba y se verifica automáticamente que no hay dos cursos asignados a la misma aula/hora. | 3 |
| RF-05 | Visualización en grilla | **Must** | El sistema debe mostrar el horario generado en una tabla semanal (lunes a sábado, 3 turnos) donde cada celda muestre: nombre del curso, aula y docente. La interfaz debe ser interactiva (click para ver detalles). | Usuario hace clic en una celda y ve ventana modal con horario completo. | 4 |
| RF-06 | Autenticación por roles | **Must** | El sistema debe permitir inicio de sesión con correo/contraseña y asignar permisos distintos para: Coordinador (CRUD completo), Estudiante (solo ver su horario), Docente (ver sus cursos asignados). | Estudiante intenta acceder a "/admin/cursos" y recibe error HTTP 403. | 1 |

---

## 3. Requerimientos No Funcionales (RNF) - Basados en ISO/IEC 25010

| ID | Atributo de calidad | Prioridad | Requerimiento SMART | Métrica de cumplimiento | Herramienta de verificación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| RNF-01 | Rendimiento / Eficiencia | **Must** | El endpoint `POST /api/schedule/generate` debe responder con el horario completo en **≤30 segundos** para el escenario máximo (50 cursos, 100 estudiantes) en hardware estándar (CPU 2.5 GHz, 8GB RAM). | Tiempo p95 < 30s en 10 ejecuciones consecutivas. | Artilley.io o k6 con prueba de carga. |
| RNF-02 | Seguridad (OWASP Top 10) | **Must** | La API REST implementará autenticación JWT con expiración cada **8 horas**. Las contraseñas se almacenarán con bcrypt (costo=10). Todos los endpoints `/api/*` validarán el token, excepto `/api/auth/login` y `/api/auth/register`. | 0 vulnerabilidades críticas y 0 altas en escaneo OWASP ZAP. | OWASP ZAP (modo automatizado). |
| RNF-03 | Usabilidad / Accesibilidad | **Should** | La interfaz de visualización de horarios cumplirá con **WCAG 2.1 nivel AA**: contraste mínimo 4.5:1, navegación por teclado (TAB, ENTER) y atributos ARIA en componentes interactivos. | Puntuación ≥ 90% en Lighthouse (categoría Accesibilidad). | Lighthouse CI integrado a GitHub Actions. |
| RNF-04 | Mantenibilidad | **Must** | El código del backend (Node.js) y frontend (React) tendrá **cobertura de pruebas unitarias ≥ 70%** (líneas y funciones). | Informe `npm test -- --coverage` muestra líneas cubiertas ≥ 70%. | Jest + React Testing Library. |
| RNF-05 | Fiabilidad / Robustez | **Should** | El motor CSP no debe fallar (crash) ante entradas inválidas (ej. restricciones imposibles). Debe retornar código HTTP 400 con mensaje "No se encontró solución factible". | Tasa de fallos no controlados < 1% en 100 ejecuciones con datos aleatorios. | Pruebas de mutación (Stryker). |
| RNF-06 | Portabilidad | **Could** | El sistema debe poder ejecutarse completamente en localhost sin dependencias externas de pago, usando MongoDB Atlas (tier gratuito) o MongoDB Community local. | El `docker-compose.yml` levanta backend, frontend y MongoDB en < 5 minutos. | Prueba en computadora limpia (VM). |
| RNF-07 | Cumplimiento de estándares | **Must** | El repositorio debe cumplir con: versionado semántico (v1.0.0 para PMV), commits convencionales (`feat:`, `fix:`), y Git Flow (ramas `main`, `develop`, `feature/*`). | Verificación manual por el docente en fecha de entrega. | Revisión de estructura de ramas en GitHub. |

---

## 4. Matriz de Trazabilidad Requerimientos - Objetivos del Proyecto

| Requerimiento | Objetivo Específico (de `C_project_charter.md`) | Relación |
| :--- | :--- | :--- |
| RF-01, RF-06 | OE-03 (Diseñar arquitectura) | Soportan la capa de gestión de datos. |
| RF-02, RF-03 | OE-02 (Modelar como CSP) | Validaciones previas al CSP. |
| RF-04 | OE-02, OE-04 (Implementar CSP, sistema funcional) | **Núcleo del valor del sistema.** |
| RF-05 | OE-04 (Sistema funcional) | Única interfaz de usuario esperada. |
| RNF-01, RNF-02, RNF-04 | OE-05 (Calidad según ISO 25010) | Impactan directamente en la evaluación de calidad. |

---

*Documento complementario al README.md y al Project Charter | Sprint 0*