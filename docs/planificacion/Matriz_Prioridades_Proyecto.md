# Matriz de Prioridades de Riesgos y Oportunidades

**Nombre del Proyecto:** UniScheduler 
**Gerente del Proyecto:** Scrum Master - Villaverde Pacheco Fabis Fabis  
**Fecha:** Abril 2026  
**Versión:** 1.0.0

---

## 1. Definición de Umbrales

| Categoría | Nivel | Puntuación | Rango de Priorización |
|:----------|:------|-----------:|:----------------------|
| **Amenazas (Riesgos)** | Muy Alto | 5 | 20 - 25 | Prioridad crítica - acción inmediata |
| | Alto | 4 | 15 - 19 | Prioridad alta - mitigar en Sprint actual |
| | Medio | 3 | 10 - 14 | Prioridad media - monitorear constantemente |
| | Bajo | 2 | 5 - 9 | Prioridad baja - aceptar o monitorear |
| | Muy Bajo | 1 | 1 - 4 | Documentar sin acción inmediata |
| **Oportunidades** | Muy Alto | 5 | 20 - 25 | Explotar agresivamente |
| | Alto | 4 | 15 - 19 | Mejorar para maximizar beneficio |
| | Medio | 3 | 10 - 14 | Potenciar si hay recursos |
| | Bajo | 2 | 5 - 9 | Monitorear sin inversión adicional |
| | Muy Bajo | 1 | 1 - 4 | Documentar para futuros sprints |

**Fórmula de priorización:** `Puntuación = Probabilidad (1-5) × Impacto (1-5)`

---

## 2. Matriz de Impacto y Probabilidad (5×5)

Esta matriz ayuda a visualizar la prioridad de las amenazas y oportunidades basándose en la multiplicación del impacto por la probabilidad.

### 2.1. Matriz de Amenazas (Riesgos Negativos)

| Impacto → | 1 (Muy Bajo) | 2 (Bajo) | 3 (Medio) | 4 (Alto) | 5 (Muy Alto) |
|:---------:|:------------:|:--------:|:---------:|:--------:|:------------:|
| **Probabilidad ↓** | | | | | |
| **5 (Muy Alta)** | 5 | 10 | 15 | 20 | **25** |
| **4 (Alta)** | 4 | 8 | 12 | **16** | 20 |
| **3 (Media)** | 3 | 6 | **9** | 12 | 15 |
| **2 (Baja)** | 2 | 4 | 6 | 8 | 10 |
| **1 (Muy Baja)** | 1 | 2 | 3 | 4 | 5 |

> **Zonas de la matriz:**
> - 🟢 Verde (1-8): Riesgo Bajo - Aceptar o monitorear
> - 🟡 Amarillo (9-12): Riesgo Medio - Requiere plan de mitigación
> - 🟠 Naranja (13-16): Riesgo Alto - Acción prioritaria
> - 🔴 Rojo (17-25): Riesgo Crítico - Acción inmediata

### 2.2. Matriz de Oportunidades (Riesgos Positivos)

| Impacto → | 1 (Muy Bajo) | 2 (Bajo) | 3 (Medio) | 4 (Alto) | 5 (Muy Alto) |
|:---------:|:------------:|:--------:|:---------:|:--------:|:------------:|
| **Probabilidad ↓** | | | | | |
| **5 (Muy Alta)** | 5 | 10 | 15 | 20 | **25** |
| **4 (Alta)** | 4 | 8 | 12 | **16** | 20 |
| **3 (Media)** | 3 | 6 | **9** | 12 | 15 |
| **2 (Baja)** | 2 | 4 | 6 | 8 | 10 |
| **1 (Muy Baja)** | 1 | 2 | 3 | 4 | 5 |

---

## 3. Identificación de Amenazas (Riesgos del Proyecto)

Basado en el `C_project_charter.md` (sección 9) y el análisis del contexto del proyecto:

| ID | Riesgo | Descripción | Probabilidad (1-5) | Impacto (1-5) | Puntuación | Prioridad |
|:---|:-------|:------------|:------------------:|:-------------:|-----------:|:---------:|
| **R-01** | Complejidad del algoritmo CSP mayor a la esperada | El motor de generación de horarios puede ser más complejo de implementar de lo estimado, requiriendo más tiempo y recursos | 4 (Alta) | 5 (Muy Alto) | **20** | 🔴 Crítica |
| **R-02** | Abandono o baja participación de algún integrante | Un miembro del equipo podría no cumplir con sus horas asignadas, afectando la velocidad del equipo | 3 (Media) | 4 (Alto) | **12** | 🟡 Media |
| **R-03** | Requerimientos cambiantes durante el desarrollo | El Product Owner o el docente podrían solicitar cambios que afecten el alcance planificado | 4 (Alta) | 3 (Medio) | **12** | 🟡 Media |
| **R-04** | Problemas de integración entre frontend y backend | Incompatibilidades entre la API REST y el consumo desde React pueden retrasar la integración | 3 (Media) | 3 (Medio) | **9** | 🟡 Media |
| **R-05** | Deuda técnica acumulada | La presión por entregar rápido puede generar código de baja calidad que afecte sprints futuros | 3 (Media) | 3 (Medio) | **9** | 🟡 Media |
| **R-06** | Tiempo insuficiente para pruebas | El cronograma ajustado puede dejar poco margen para pruebas exhaustivas | 4 (Alta) | 3 (Medio) | **12** | 🟡 Media |
| **R-07** | Fallo en servicios externos (GitHub, MongoDB Atlas) | Dependencia de servicios gratuitos que podrían tener interrupciones | 2 (Baja) | 3 (Medio) | **6** | 🟢 Baja |
| **R-08** | Curva de aprendizaje de MongoDB | El equipo tiene experiencia limitada en MongoDB, lo que podría ralentizar el desarrollo inicial | 2 (Baja) | 2 (Bajo) | **4** | 🟢 Muy Baja |

---

## 4. Identificación de Oportunidades

| ID | Oportunidad | Descripción | Probabilidad (1-5) | Impacto (1-5) | Puntuación | Prioridad |
|:---|:------------|:------------|:------------------:|:-------------:|-----------:|:---------:|
| **OP-01** | Reutilización de librerías CSP existentes | Existen librerías open source de CSP que podrían acelerar la implementación del motor | 4 (Alta) | 4 (Alto) | **16** | 🟠 Alta |
| **OP-02** | Documentación como diferenciador | Una documentación completa y bien estructurada puede destacar el proyecto en la evaluación | 5 (Muy Alta) | 3 (Medio) | **15** | 🟠 Alta |
| **OP-03** | Aprendizaje del stack MERN | El equipo desarrolla habilidades valiosas en tecnologías demandadas por la industria | 5 (Muy Alta) | 3 (Medio) | **15** | 🟠 Alta |
| **OP-04** | Extensibilidad del CSP a IA/ML | El motor desarrollado podría evolucionar a soluciones más avanzadas en futuras versiones | 3 (Media) | 4 (Alto) | **12** | 🟡 Media |
| **OP-05** | Reconocimiento académico | Un proyecto exitoso podría ser presentado en ferias o congresos universitarios | 2 (Baja) | 4 (Alto) | **8** | 🟢 Baja |

---

## 5. Mapa de Riesgos (Ubicación en la Matriz)

### 5.1. Amenazas (Riesgos Negativos)

### Matriz de Riesgos


| Impacto | Probabilidad | ID Riesgo (Puntaje) | Nivel |
| :---: | :---: | :--- | :--- |
| **5** | 4 | R-01 (20) | 🔴 Crítico |
| **4** | 3 | R-02 (12), R-03 (12), R-06 (12) | 🟡 Alto |
| **3** | 3 | R-04 (9), R-05 (9) | 🟡 Medio |
| **2** | 3 | R-07 (6) | 🟢 Bajo |
| **1** | 4 | R-08 (4) | 🟢 Muy Bajo |

---

### Detalle de Riesgos
*   **Crítico 🔴**: R-01
*   **Alto/Medio 🟡**: R-02, R-03, R-06, R-04, R-05
*   **Bajo 🟢**: R-07, R-08


### 5.2. Oportunidades (Riesgos Positivos)

### Matriz de Oportunidades


| Impacto | Probabilidad | ID Oportunidad (Puntaje) | Prioridad |
| :---: | :---: | :--- | :--- |
| **5** | - | - | - |
| **4** | 4, 3 | OP-01 (16), OP-04 (12) | 🟠 Alta / 🟡 Media |
| **3** | 5, 5 | OP-02 (15), OP-03 (15) | 🟠 Alta |
| **2** | 4 | OP-05 (8) | 🟢 Baja |
| **1** | - | - | - |

---

### Resumen de Oportunidades
*   **Prioridad Alta 🟠**: OP-01, OP-02, OP-03
*   **Prioridad Media 🟡**: OP-04
*   **Prioridad Baja 🟢**: OP-05


---

## 6. Plan de Respuesta a Amenazas

| ID | Riesgo | Estrategia | Acciones de Mitigación | Responsable | Sprint objetivo |
|:---|:-------|:-----------|:-----------------------|:------------|:---------------:|
| **R-01** | Complejidad del CSP | Mitigar | Investigar librerías existentes (OP-01); implementar CSP simplificado primero; dedicar horas de contingencia | Backend Dev (CSP) | Sprint 3 |
| **R-02** | Baja participación | Mitigar | Documentación detallada de decisiones; distribución de tareas con redundancia; registro de horas semanales | Scrum Master | Sprint 0 - 5 |
| **R-03** | Requerimientos cambiantes | Aceptar | Scrum como metodología absorbe cambios; priorizar con Product Owner | Product Owner | Sprint 0 - 5 |
| **R-04** | Problemas de integración | Mitigar | Definir contratos de API (Swagger/OpenAPI) desde Sprint 1; pruebas de integración tempranas | Dev Lead | Sprint 1 y 4 |
| **R-05** | Deuda técnica | Mitigar | Code reviews obligatorios en cada PR; estándares de código definidos desde Sprint 0 | Dev Lead | Sprint 0 - 5 |
| **R-06** | Tiempo insuficiente para pruebas | Mitigar | Incluir pruebas desde Sprint 1; automatizar con GitHub Actions | QA Engineer | Sprint 1 - 5 |
| **R-07** | Fallo en servicios externos | Aceptar | Tener alternativas locales (MongoDB local, GitLab como respaldo) | Todos | Sprint 0 |
| **R-08** | Curva de aprendizaje MongoDB | Mitigar | Dedicar horas de investigación al inicio del Sprint 1; documentar mejores prácticas | Backend Dev | Sprint 1 |

---

## 7. Plan de Respuesta a Oportunidades

| ID | Oportunidad | Estrategia | Acciones para Explotar/Mejorar | Responsable | Sprint objetivo |
|:---|:------------|:-----------|:-------------------------------|:------------|:---------------:|
| **OP-01** | Librerías CSP existentes | Explotar | Investigar `csp-solver` o implementaciones similares; hacer POC en Sprint 2 | Backend Dev (CSP) | Sprint 2 |
| **OP-02** | Documentación como diferenciador | Mejorar | Mantener documentación actualizada; usar plantillas profesionales | Scrum Master | Sprint 0 - 5 |
| **OP-03** | Aprendizaje del stack MERN | Explotar | Documentar lecciones aprendidas; crear guías internas | Todo el equipo | Sprint 0 - 5 |
| **OP-04** | Extensibilidad a IA/ML | Potenciar | Diseñar CSP con interfaz modular que permita futuros reemplazos | Dev Lead | Sprint 3 |
| **OP-05** | Reconocimiento académico | Mejorar | Preparar presentación ejecutiva; grabar video demostrativo de alta calidad | Scrum Master | Sprint 5 |

---

## 8. Resumen de Prioridades

### 8.1. Amenazas por Prioridad

| Prioridad | IDs | Puntuación | Acción Requerida |
|:----------|:----|-----------:|:-----------------|
| 🔴 Crítica | R-01 | 20 | Acción inmediata en Sprint 3 |
| 🟠 Alta | Ninguno | 15-19 | - |
| 🟡 Media | R-02, R-03, R-06 | 12 | Plan de mitigación por sprint |
| 🟡 Media | R-04, R-05 | 9 | Monitoreo constante |
| 🟢 Baja | R-07 | 6 | Aceptar, monitorear ocasionalmente |
| 🟢 Muy Baja | R-08 | 4 | Documentar |

### 8.2. Oportunidades por Prioridad

| Prioridad | IDs | Puntuación | Acción Requerida |
|:----------|:----|-----------:|:-----------------|
| 🟠 Alta | OP-01, OP-02, OP-03 | 15-16 | Asignar recursos para maximizar beneficio |
| 🟡 Media | OP-04 | 12 | Potenciar si hay capacidad disponible |
| 🟢 Baja | OP-05 | 8 | Documentar para futuros sprints |

---

## 9. Seguimiento y Control de Riesgos

| Actividad | Frecuencia | Responsable |
|:----------|:-----------|:------------|
| Revisión de riesgos en Daily Scrum | Diaria | Scrum Master |
| Actualización de matriz de riesgos | Semanal | Scrum Master |
| Evaluación de nuevos riesgos | Cada Sprint Planning | Todo el equipo |
| Cierre de riesgos mitigados | Cada Sprint Review | Product Owner |

---

**Elaborado por:** Chavez Apaza Marcos - Sprint 0  
**Fecha:** Abril 2026  
**Estado:** Aprobado (consistente con `C_project_charter.md` y análisis del proyecto)
