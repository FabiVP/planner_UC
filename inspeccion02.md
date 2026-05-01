# Inspección 02 - Taller de Proyectos 2

**Curso:** Taller de Proyectos 2 - ISI  
**Estudiante:** Villaverde Pacheco Fabiola Karina  
**Fecha:** 01 de mayo de 2026  
**Repositorio:** https://github.com/FabiVP/planner_UC  

---

## Lista de Artefactos Desarrollados y Relación con la Consigna TP2

A continuación, se lista cada artefacto del repositorio y se especifica su correspondencia con los requisitos de la consigna académica (TP2).

| # | Artefacto (Archivo/Carpeta) | Ubicación | Requisito de la Consigna que Cumple | Justificación |
|---|----------------------------|-----------|--------------------------------------|----------------|
| 1 | `README.md` | Raíz | Descripción del sistema, instalación, arquitectura (pág. 3-4) | Contiene visión del proyecto, problemática, justificación de complejidad, restricciones CSP, requerimientos SMART, tecnologías, arquitectura, instrucciones de instalación y despliegue. |
| 2 | `docs/planificacion/jira/analisis-metricas-agiles.md` | `docs/planificacion/jira/` | Planificación en Jira + métricas ágiles + análisis (pág. 1-2) | Incluye enlace al tablero Jira, interpretación de evolución del proyecto, identificación de cuellos de botella (estancamiento por RD-03), evaluación de estabilidad del equipo y coherencia con complejidad CSP. |
| 3 | `docs/planificacion/jira/metricas/` (5 imágenes) | `docs/planificacion/jira/metricas/` | 4 gráficos obligatorios (pág. 2) | Contiene: Burndown Chart, Burnup Chart (Sprint 1 y 2), Velocity Chart y Control Chart. |
| 4 | `docs/planificacion/Presupuesto/Fuentes_de_Costos_Proyecto.md` | `docs/planificacion/Presupuesto/` | Fuentes de costos (RRHH, infraestructura, indirectos) (pág. 2) | Desglose detallado de costos por tarea, horas hombre, costo de material, otros costos (travel = 0 por trabajo remoto). |
| 5 | `docs/planificacion/Presupuesto/Costos_a_lo_largo_del_tiempo.md` | `docs/planificacion/Presupuesto/` | Evolución de costos a lo largo del tiempo (pág. 2) | Distribución cronológica de costos por semana, mes y fase del proyecto. |
| 6 | `docs/planificacion/Presupuesto/Costos_por_Sprint.md` | `docs/planificacion/Presupuesto/` | Costos por Sprint (pág. 2) | Desglose de costos para Sprint 0 a Sprint 5, más gestión continua. |
| 7 | `docs/planificacion/Presupuesto/Hoja_de_Datos_Proyecto.md` | `docs/planificacion/Presupuesto/` | Costo acumulado + análisis Green Software (pág. 2) | Incluye tabla de costo acumulado por mes, gráfico de Curva S, análisis de sostenibilidad con optimización CSP (0.597s, consumo energético reducido). |
| 8 | `docs/planificacion/Registro_de_riesgos/Registro_de_Riesgos.md` | `docs/planificacion/Registro_de_riesgos/` | Registro de riesgos (probabilidad, impacto, mitigación) (pág. 2-3) | Contiene 8 riesgos con ID, descripción, área de impacto, probabilidad (1-5), impacto (1-5), puntuación, estado, asignado y estrategia. |
| 9 | `docs/planificacion/Registro_de_riesgos/Registro_de_Oportunidades.md` | `docs/planificacion/Registro_de_riesgos/` | Registro de oportunidades (pág. 2) | Contiene 5 oportunidades con impacto positivo, estrategia de aprovechamiento (Explotar/Mejorar/Potenciar). |
| 10 | `docs/planificacion/Registro_de_riesgos/Matriz_Prioridades_Proyecto.md` | `docs/planificacion/Registro_de_riesgos/` | Relación riesgos con restricciones CSP (pág. 3) | Incluye matriz 5×5 de impacto vs probabilidad, identificación de riesgo crítico R-01 (complejidad CSP) con puntuación 20, y plan de respuesta. |
| 11 | `docs/planificacion/Registro_de_riesgos/Categorias_de_Riesgos.md` | `docs/planificacion/Registro_de_riesgos/` | Relación con limitaciones técnicas y dependencias externas (pág. 3) | Define categorías (Técnicos, Externos, Organizacionales, Gestión) y subcategorías. |
| 12 | `docs/planificacion/Registro_de_riesgos/Definiciones.md` | `docs/planificacion/Registro_de_riesgos/` | Escalas y definiciones para evaluación (pág. 3) | Define escalas de impacto, probabilidad, puntuación, detectabilidad, estado y estrategias. |
| 13 | `docs/planificacion/sdd/constitution.md` | `docs/planificacion/sdd/` | Agents.md o constitution.md (pág. 3) | Contiene: principios del sistema (validez sobre optimalidad, rendimiento <30s, trazabilidad, modularidad), reglas globales, restricciones duras (RD-01 a RD-06) y blandas (RS-01). |
| 14 | `docs/planificacion/sdd/spec.md` | `docs/planificacion/sdd/` | Spec.md (entradas, salidas, reglas de negocio, casos límite) (pág. 3) | Define entidades base, configuración horaria, formato JSON de salida, reglas de negocio formales (créditos, prerrequisitos, no solapamientos), casos límite (sin solución, docente faltante, aula insuficiente). |
| 15 | `docs/planificacion/sdd/plan.md` | `docs/planificacion/sdd/` | Plus adicional (plan de implementación técnica) | Incluye arquitectura, stack tecnológico, secuencia de implementación, verificación de constitution, restricciones técnicas, supuestos y métricas de éxito. |
| 16 | `docs/antigravity/evidencia.md` | `docs/antigravity/` | Evidencia de implementación SDD + TDD (pág. 3) | Documenta el uso de Google Antigravity, pruebas unitarias (12/12 pasadas), cobertura 84.26%, horario generado (0.597s), enlaces al código fuente del CSP. |
| 17 | `backend/engine/csp.js` + `backend/engine/constraints.js` | `backend/engine/` | Implementación del motor CSP (pág. 3) | Código fuente del algoritmo de backtracking con MRV, forward checking, y restricciones RD-01 a RD-06. |
| 18 | `backend/tests/csp.test.js` | `backend/tests/` | Pruebas TDD del motor CSP | 12 pruebas unitarias que validan el correcto funcionamiento del CSP. |

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

Por medio del presente, declaro que:

1. Se ha revisado la consigna y la rúbrica de evaluación disponibles en el aula virtual.
2. El repositorio ha sido actualizado con todos los artefactos solicitados en la consigna TP2.
3. La lista anterior especifica claramente la relación de cada artefacto con los requerimientos de la consigna.
4. El video demostrativo cumple con la duración solicitada (4-5 minutos) y muestra el prototipo funcionando.

**Fecha:** 01 de mayo de 2026  
**Firma:**  

Villaverde Pacheco Fabiola Karina  
Scrum Master - UniScheduler