# Costos por Sprint

**Nombre del Proyecto:** UniScheduler
**Gerente del Proyecto:** Scrum Master - Villaverde Pacheco Fabis Fabis

---

## Desglose de Gastos por Sprint

| Item | Fecha | Costo (S/) | Razón |
|:-----|:------|----------:|:------|
| **Sprint 1 - Gestión de Entidades** | Semana 3-4 (Abril-Mayo 2026) | | |
| Configuración backend (Express + MongoDB) | Semana 3 | 168.00 | Levantamiento del servidor, conexión a BD, variables de entorno |
| Modelos Mongoose (Usuario, Curso, Docente, Aula) | Semana 3 | 208.00 | Definición de esquemas, validaciones, relaciones |
| Autenticación JWT + bcrypt | Semana 3 | 168.00 | Registro, login, middleware de autenticación |
| CRUD de entidades (API REST) | Semana 4 | 168.00 | Endpoints completos para gestionar cursos, docentes, aulas |
| Frontend básico (React + login + listado) | Semana 4 | 128.00 | Pantalla de login, dashboard simple, listado de cursos |
| **Subtotal Sprint 1** | | **840.00** | |
| **Sprint 2 - Validación de Matrícula** | Semana 5-6 (Mayo 2026) | | |
| Validación de prerrequisitos | Semana 5 | 168.00 | Verificación de cursos aprobados vs. requeridos |
| Validación de rango de créditos (20-22) | Semana 5 | 125.00 | Validación automática de carga académica |
| Frontend selector de cursos para estudiante | Semana 5 | 168.00 | Interfaz para que el estudiante elija sus cursos |
| Integración de validaciones en API | Semana 6 | 126.00 | Conexión de validaciones con el backend |
| Pruebas unitarias de validación | Semana 6 | 85.00 | Tests automatizados para validaciones |
| **Subtotal Sprint 2** | | **672.00** | |
| **Sprint 3 - Motor CSP** | Semana 7-9 (Mayo-Junio 2026) | | |
| Investigación e implementación de backtracking | Semana 7 | 313.00 | Estudio e implementación del algoritmo base |
| Heurística MRV (Minimum Remaining Values) | Semana 7 | 209.00 | Optimización para elegir la variable más restringida |
| Forward Checking y poda | Semana 8 | 209.00 | Propagación de restricciones para reducir el espacio de búsqueda |
| Implementación de restricciones RD-01 a RD-06 | Semana 8 | 263.00 | Codificación de las 6 restricciones duras del dominio |
| Manejo de timeout (30s) y solución parcial | Semana 9 | 159.00 | Control de tiempo y retorno de mejor solución encontrada |
| Pruebas de integración del CSP | Semana 9 | 107.00 | Validación del motor con diferentes escenarios |
| **Subtotal Sprint 3** | | **1,260.00** | |
| **Sprint 4 - Visualización y Pruebas** | Semana 10-11 (Junio 2026) | | |
| Grilla semanal interactiva (React) | Semana 10 | 236.00 | Tabla dinámica lunes-sábado, turnos mañana/tarde/noche |
| Conexión frontend con endpoint de generación | Semana 10 | 142.00 | Integración del motor CSP con la interfaz de usuario |
| Pruebas unitarias backend (Jest) | Semana 10 | 142.00 | Tests automatizados para el backend |
| Pruebas de integración y cobertura ≥70% | Semana 11 | 141.00 | Validación completa del sistema y métricas de cobertura |
| Corrección de errores y refinamiento | Semana 11 | 94.00 | Bug fixing y mejoras de última hora |
| **Subtotal Sprint 4** | | **755.00** | |
| **Sprint 5 - Cierre y Documentación** | Semana 12 (Julio 2026) | | |
| Documentación técnica final | Semana 12 | 169.00 | Elaboración de documentación completa del sistema |
| README.md definitivo con TOC | Semana 12 | 85.00 | Punto de entrada central con tabla de contenidos |
| Video demostrativo (máx 5 min) | Semana 12 | 130.00 | Grabación y edición del video de presentación |
| Preparación de entrega final | Semana 12 | 126.00 | Empaquetado, revisión y envío de entregables |
| **Subtotal Sprint 5** | | **510.00** | |
| | | | |
| **TOTAL PROYECTO (sin contingencia)** | | **4,037.00** | (suma de los 5 Sprints) |
| **Gestión continua del proyecto** | Semana 1-12 | **843.00** | (Daily Scrum, Code Reviews, actas - ver detalle abajo) |
| **Inicio y Planificación (Sprint 0)** | Semana 1-2 | **665.00** | (ver detalle abajo) |
| | | | |
| **SUBTOTAL GENERAL** | | **5,545.00** | |
| **Contingencia (12%)** | | **665.40** | Riesgos: complejidad CSP, integración, ajustes |
| **TOTAL PROYECTO (con contingencia)** | | **6,210.40** | |

---

## Detalle de Sprint 0 (Inicio y Planificación) - No incluido en Sprints 1-5

| Item | Fecha | Costo (S/) | Razón |
|:-----|:------|----------:|:------|
| Kick-off y configuración inicial | Semana 1 | 250.00 | Reuniones iniciales, GitHub, discord, herramientas de comunicación |
| Documentación base (visión, charter, enfoque) | Semana 1-2 | 200.00 | Elaboración de visión, charter, enfoque, supuestos |
| Análisis del problema y CSP | Semana 2 | 215.00 | Investigación de algoritmos, definición formal del problema |
| **Subtotal Sprint 0** | | **665.00** | |

---

## Detalle de Gestión Continua (durante todo el proyecto)

| Item | Frecuencia | Costo (S/) | Razón |
|:-----|:-----------|----------:|:------|
| Reuniones diarias (Daily Scrum) | Semanal (5×12 semanas) | 418.00 | 15 min diarios × 5 integrantes × 12 semanas |
| Code reviews y pull requests | Por cada PR (estimado 30) | 213.00 | Revisión de código, aprobaciones en GitHub |
| Actualización de tablero y actas | Semanal | 212.00 | Mantenimiento de documentación de gestión |
| **Subtotal Gestión** | | **843.00** | |

---

## Resumen de Costos por Sprint

| Sprint | Nombre | Periodo | Costo (S/) | % del total (sin contingencia) |
|:-------|:-------|:--------|----------:|-------------------------------:|
| Sprint 0 | Inicio y Planificación | Semana 1-2 | 665.00 | 10.7% |
| Sprint 1 | Gestión de Entidades | Semana 3-4 | 840.00 | 13.5% |
| Sprint 2 | Validación de Matrícula | Semana 5-6 | 672.00 | 10.8% |
| Sprint 3 | Motor CSP | Semana 7-9 | 1,260.00 | 20.3% |
| Sprint 4 | Visualización y Pruebas | Semana 10-11 | 755.00 | 12.2% |
| Sprint 5 | Cierre y Documentación | Semana 12 | 510.00 | 8.2% |
| Gestión | Gestión continua | Semana 1-12 | 843.00 | 13.6% |
| **Subtotal** | | | **5,545.00** | **89.3%*** |
| Contingencia | (12%) | | 665.40 | 10.7% |
| **TOTAL** | | | **6,210.40** | **100%** |

> *El subtotal excluye la contingencia, por eso suma 89.3% del total con contingencia.

---

## Comparativa de Costos entre Sprints (gráfico textual)
Costo (S/)
|
1400| ● (S3: 1,260)
| ●
1200| ●
| ●
1000| ● (S1: 840)
| │
800 | │ ● (S4: 755)
| │ │ ● (S5: 510)
600 | │ │ │
| │ │ │
400 | │ │ │
| │ │ │
200 | │ │ │
| │ │ │
0 +----┴───┴───┴───► Sprint
S1 S2 S3 S4 S5


---

## Notas y Justificación

1. **Consistencia documental:** Los valores de este documento coinciden exactamente con los de:
   - `Fuentes_de_Costos_Proyecto.md` (desglose por tarea)
   - `Costos_a_lo_largo_del_tiempo.md` (distribución temporal)

2. **Sprint 0 (Inicio) no está en la tabla principal:** Se ha separado para mantener la estructura original del archivo (Sprints 1-5), pero se incluye como parte del total general.

3. **Gestión continua:** Aunque no es un sprint formal, se ha incluido como categoría separada porque las actividades de gestión (Daily Scrum, code reviews, actas) ocurren durante todo el proyecto.

4. **Sprint 3 (Motor CSP) es el más costoso:** Con S/1,260 (20.3% del subtotal), refleja la mayor complejidad técnica del proyecto.

5. **Travel Costos = S/0:** Al igual que en los documentos anteriores, los costos de viaje son cero porque el equipo trabaja 100% remoto.

6. **Contingencia (12%):** Aplicada al subtotal general (S/5,545 × 1.12 = S/6,210.40)

---

## Verificación de consistencia con otros documentos

| Concepto | Fuentes de Costos | Costos a lo largo del tiempo | Costos por Sprint | ¿Consistente? |
|:---------|:-----------------:|:---------------------------:|:-----------------:|:-------------:|
| Total Sprint 1 | S/840 | S/840 | S/840 | ✅ Sí |
| Total Sprint 2 | S/672 | S/672 | S/672 | ✅ Sí |
| Total Sprint 3 | S/1,260 | S/1,260 | S/1,260 | ✅ Sí |
| Total Sprint 4 | S/755 | S/755 | S/755 | ✅ Sí |
| Total Sprint 5 | S/510 | S/510 | S/510 | ✅ Sí |
| Sprint 0 + Gestión | S/1,508 | S/1,508 | S/1,508 | ✅ Sí |
| Subtotal | S/5,545 | S/5,545 | S/5,545 | ✅ Sí |
| Contingencia (12%) | S/665.40 | S/665.40 | S/665.40 | ✅ Sí |
| **TOTAL** | **S/6,210.40** | **S/6,210.40** | **S/6,210.40** | **✅ Sí** |

---

**Elaborado por:** ChavezApazaMarcos - Sprint 0  
**Fecha:** Abril 2026  
**Estado:** Aprobado (consistente con Fuentes_de_Costos y Costos_a_lo_largo_del_tiempo)

