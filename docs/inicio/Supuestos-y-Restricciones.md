# Registro de Supuestos y Restricciones
**Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Institución:** Universidad Continental  
**Versión:** 1.0.0  
**Fecha:** Abril 2026

---

## 1. Introducción

Este documento registra todos los supuestos asumidos por el equipo para simplificar o delimitar el problema, así como las restricciones reales que condicionan el desarrollo del proyecto. Ambos elementos son fundamentales para justificar las decisiones de diseño y desarrollo adoptadas durante el Sprint 0.

---

## 2. Registro de Supuestos

Los supuestos son condiciones que se asumen como verdaderas para continuar con el diseño de la solución, sin que hayan sido formalmente verificadas. Cada supuesto lleva una justificación.

### 2.1. Supuestos del Dominio del Problema

| ID | Supuesto | Justificación | Impacto si es falso |
|---|---|---|---|
| SA-01 | Los datos de estudiantes, docentes, cursos y aulas estarán disponibles en formato estructurado para ser ingresados al sistema | El sistema requiere datos base para funcionar; se asume que el equipo de pruebas proveerá datasets de prueba | Alto: el sistema no puede generar horarios sin datos de entrada |
| SA-02 | Cada docente puede ser asignado a no más de 3 cursos por semestre | Práctica académica común en universidades peruanas; limita la complejidad del CSP | Medio: ajustar restricción en el modelo |
| SA-03 | Las aulas tienen capacidad fija y tipo definido (teórica / laboratorio) | Necesario para la restricción de infraestructura del CSP | Medio: el motor de asignación requeriría ajustes |
| SA-04 | El límite de créditos por estudiante es de 20 a 22 créditos por semestre, según la consigna | Establecido explícitamente en la consigna del PFA | Bajo: ajustar la validación |
| SA-05 | Los horarios se planifican para una semana tipo (lunes a sábado, turnos mañana/tarde/noche) | Simplificación del modelo temporal para el PMV | Medio: requeriría adaptar el modelo de dominio |
| SA-06 | Los prerrequisitos de cada curso son datos conocidos y no cambian durante un semestre | Necesario para la validación estática de matrícula | Bajo: actualizar catálogo de cursos |
| SA-07 | El sistema no necesita integrarse con sistemas externos (SIS, ERP) en el PMV v1.0.0 | Restricción de alcance deliberada para reducir complejidad del PMV | Alto: cambiaría la arquitectura de integración |

### 2.2. Supuestos del Proyecto

| ID | Supuesto | Justificación | Impacto si es falso |
|---|---|---|---|
| SP-01 | El equipo completo estará disponible durante las 12 semanas del proyecto | Condición necesaria para cumplir el cronograma Scrum | Alto: redistribución de tareas y posible retraso |
| SP-02 | Los integrantes del equipo tienen conocimientos básicos de JavaScript/Node.js y React | El stack MERN requiere estas habilidades previas | Alto: aumentar tiempo de aprendizaje en Sprint 0 |
| SP-03 | GitHub y MongoDB Atlas estarán disponibles y operativos durante todo el periodo | Dependencia de servicios externos gratuitos | Medio: usar alternativas locales (SQLite, GitLab) |
| SP-04 | El docente proporcionará retroalimentación al final de cada Sprint para ajustar el alcance | Parte del proceso Scrum educativo | Medio: equipo tomará decisiones autónomas |

---

## 3. Registro de Restricciones

Las restricciones son condiciones impuestas que limitan las opciones de diseño o ejecución del proyecto. Son hechos, no supuestos.

### 3.1. Restricciones Técnicas

| ID | Restricción | Origen | Impacto en el diseño |
|---|---|---|---|
| RT-01 | El stack tecnológico obligatorio es MERN (MongoDB, Express, React, Node) | Consigna del PFA (sección 2) | El equipo no puede usar tecnologías fuera de este stack sin justificación adicional |
| RT-02 | La arquitectura debe ser SPA (frontend) + API REST (backend) | Consigna del PFA – Lineamientos de ingeniería | Define la separación obligatoria frontend/backend |
| RT-03 | Se debe aplicar versionado semántico; el PMV debe etiquetarse como v1.0.0 | Consigna del repositorio (sección 3.3) | Todos los releases deben seguir el esquema MAJOR.MINOR.PATCH |
| RT-04 | El repositorio debe incluir: ramas, commits significativos y pull requests | Consigna del repositorio (sección 3.2) | La ausencia de estos elementos es incumplimiento metodológico |
| RT-05 | La capacidad computacional disponible es limitada (hardware de estudiantes) | Restricción real del entorno académico | El motor CSP debe ser eficiente; evitar algoritmos exponenciales sin poda |
| RT-06 | Se deben cumplir los estándares: W3C, ISO/IEC 25010, OWASP Top 10, WCAG, Green Software | Consigna del PFA (sección 7.2) | El diseño de UI, seguridad y código debe ser validado contra estos estándares |

### 3.2. Restricciones Económicas

| ID | Restricción | Origen | Impacto |
|---|---|---|---|
| RE-01 | El proyecto debe desarrollarse con herramientas y servicios gratuitos | Contexto académico; los estudiantes no tienen presupuesto asignado | Uso obligatorio de tiers gratuitos: MongoDB Atlas Free, Render, Vercel, GitHub Free |
| RE-02 | No se puede contratar servicios de hosting de pago | Restricción del equipo | El PMV debe funcionar en entornos de desarrollo local o plataformas gratuitas |

### 3.3. Restricciones Sociales

| ID | Restricción | Origen | Impacto |
|---|---|---|---|
| RS-01 | El sistema debe garantizar equidad en la asignación de horarios (no discriminación por grupo o turno) | Consigna del PFA (sección 6.c) | El algoritmo CSP no puede priorizar estudiantes arbitrariamente |
| RS-02 | Los datos personales de estudiantes y docentes deben protegerse (LOPD/privacidad) | Ética y legislación peruana de protección de datos | El sistema debe implementar autenticación y no exponer datos sensibles en APIs públicas |

### 3.4. Restricciones Temporales

| ID | Restricción | Origen | Impacto |
|---|---|---|---|
| RC-01 | El proyecto tiene una duración fija de 12 semanas | Calendario académico de la Universidad Continental | El alcance del PMV debe ajustarse estrictamente a este plazo |
| RC-02 | Cada Sprint tiene una duración definida y no negociable | Estructura del curso | Los entregables de cada Sprint deben completarse en su período asignado |

### 3.5. Restricciones de Seguridad

| ID | Restricción | Origen | Impacto |
|---|---|---|---|
| RsE-01 | La API REST debe implementar autenticación con JWT (JSON Web Tokens) | OWASP Top 10 (A01: Broken Access Control) | Todos los endpoints protegidos deben validar token en cada request |
| RsE-02 | Las contraseñas deben almacenarse con hash (bcrypt) | OWASP Top 10 (A02: Cryptographic Failures) | No se puede almacenar contraseñas en texto plano |
| RsE-03 | Los inputs del usuario deben validarse y sanitizarse | OWASP Top 10 (A03: Injection) | Implementar validación tanto en frontend como en backend |

### 3.6. Restricciones del Dominio (CSP) con Priorización para PMV

| ID | Restricción del modelo | Tipo | Prioridad PMV | Impacto si se omite |
|---|---|---|---|---|
| RD-01 | Un docente no puede estar asignado a dos cursos al mismo tiempo | Dura (hard) | **Alta (Obligatoria)** | Horario inválido (conflicto de persona) |
| RD-02 | Un aula no puede ser asignada a dos cursos al mismo tiempo | Dura (hard) | **Alta (Obligatoria)** | Horario inválido (doble reserva) |
| RD-03 | Un estudiante no puede tener dos cursos solapados en su horario | Dura (hard) | **Alta (Obligatoria)** | Estudiante no puede asistir a dos clases |
| RD-04 | El total de créditos por estudiante debe estar entre 20 y 22 | Dura (hard) | **Alta (Obligatoria)** | Incumplimiento normativa académica |
| RD-05 | Un curso solo puede ser tomado si se cumplen todos sus prerrequisitos | Dura (hard) | **Alta (Obligatoria)** | Estudiante cursa sin base conceptual |
| RD-06 | El tipo de aula debe coincidir con el tipo de curso (teórico/laboratorio) | Dura (hard) | **Media (Sprint 3)** | Clase teórica en laboratorio (ineficiencia, no invalidez) |

---

### 3.7. Factores Técnicos, Operativos y Contextuales que Condicionan el CSP

| Categoría | Factor | Condición sobre el diseño del motor CSP |
| :--- | :--- | :--- |
| **Técnicos** | Hardware limitado (equipos de estudiantes, 8GB RAM, CPU 2.5 GHz) | El algoritmo NO puede ser exponencial puro (fuerza bruta). Requiere poda heurística (MRV, forward checking). |
| **Técnicos** | Tiempo de respuesta máximo aceptable | El usuario no esperará más de **30 segundos** para 50 cursos. El CSP debe implementar *timeout* y retornar mejor solución encontrada. |
| **Operativos** | Los datos de entrada (matrícula, disponibilidad) cambian cada semestre | El CSP debe funcionar con **conjuntos de datos variables**, no precalculados. No se puede hardcodear nada. |
| **Operativos** | El coordinador necesita depurar conflictos | El motor debe poder **explicar por qué una asignación falló** (ej. "no hay aula disponible el lunes 8am para curso X"). |
| **Contextuales** | Currículo flexible (cada estudiante tiene historial único de cursos aprobados) | La restricción RD-03 (no solapamiento de estudiante) es **la más costosa de validar**: O(n^2 × e) donde e = #estudiantes. Se requiere indexación en memoria. |
| **Contextuales** | Equidad en asignación (no priorizar un grupo sobre otro) | El CSP debe aleatorizar el orden de asignación o rotar prioridades para evitar sesgos sistemáticos. |

## 4. Estrategia de Priorización de Restricciones del CSP

Para el PMV v1.0.0, las restricciones se priorizan de la siguiente manera:

| Prioridad | Restricciones | Justificación |
|---|---|---|
| **Alta (implementación obligatoria)** | RD-01, RD-02, RD-03, RD-04, RD-05 | Son restricciones duras sin las cuales el horario sería inválido |
| **Media (implementación en Sprint 3)** | RD-06, disponibilidad de docentes | Mejoran la calidad del horario pero el sistema puede funcionar sin ellas |
| **Baja (versiones futuras)** | Optimización de preferencias de horario de estudiantes | Restricciones blandas que mejoran la experiencia pero no son críticas |

---

## 5. Matriz de Trazabilidad Supuestos–Restricciones

| Supuesto | Restricción relacionada | Relación |
|---|---|---|
| SA-04 (créditos 20–22) | RD-04 | El supuesto valida la restricción dura del CSP |
| SA-06 (prerrequisitos conocidos) | RD-05 | El supuesto permite implementar la restricción de manera estática |
| SA-05 (semana tipo) | RD-01, RD-02, RD-03 | La simplificación temporal hace tratables las restricciones de solapamiento |
| SP-02 (habilidades del equipo) | RT-01 (stack MERN) | El supuesto valida que la restricción tecnológica es implementable |

---

*Documento elaborado por el equipo del PFA — Sprint 0 | Universidad Continental | Abril 2026*
