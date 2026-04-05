# Registro de Supuestos y Restricciones

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Universidad:** Universidad Continental  
**Fecha:** Marzo 2026  
**Versión:** 1.0

---

## 1. Supuestos del proyecto

Los supuestos son condiciones que el equipo asume como verdaderas para efectos de planificación, sin tener certeza absoluta de su cumplimiento. Si algún supuesto resulta falso, deberá activarse el plan de respuesta correspondiente.

| # | Supuesto | Área | Impacto si es falso | Plan de respuesta |
|---|---|---|---|---|
| S01 | El equipo dispone de conexión a internet estable para trabajar con GitHub y MongoDB Atlas | Técnica | Retrasos en control de versiones y acceso a base de datos | Uso de PostgreSQL local como respaldo |
| S02 | Los tres integrantes pueden dedicar al menos 8 horas semanales al proyecto | Gestión | Incumplimiento del cronograma | Redistribución de tareas y reprogramación de entregas |
| S03 | El docente revisará y validará los entregables al término de cada sprint | Gestión | Falta de retroalimentación oportuna | El equipo realiza autoevaluación interna antes de cada entrega |
| S04 | Los requerimientos del sistema no cambiarán de forma significativa durante el desarrollo | Alcance | Retrabajo y posible rediseño de módulos | Gestión de cambios formal mediante acta de cambio en `docs/` |
| S05 | El algoritmo CSP básico (backtracking) es suficiente para generar horarios válidos en el contexto del PMV | Técnica | El sistema no converge en tiempos aceptables | Aplicar heurísticas de ordenamiento de variables (MRV, grado) |
| S06 | Los usuarios del sistema (coordinadores y estudiantes) tienen acceso a un navegador web moderno | Técnica | Problemas de compatibilidad de interfaz | Implementar diseño responsivo y pruebas en Chrome/Firefox |
| S07 | El stack MERN es suficiente para cumplir con todos los requerimientos funcionales del PMV | Técnica | Necesidad de tecnologías adicionales no planificadas | Evaluar librerías de apoyo dentro del ecosistema Node.js |
| S08 | El free tier de MongoDB Atlas y Vercel/Render cubre las necesidades del PMV durante el desarrollo | Técnica | Limitaciones de almacenamiento o tiempo de ejecución | Migrar a instancia local o ajustar plan de despliegue |

---

## 2. Restricciones del proyecto

Las restricciones son condiciones fijas que limitan las opciones del equipo. No son negociables dentro del alcance actual del proyecto.

| # | Restricción | Tipo | Descripción |
|---|---|---|---|
| R01 | Duración máxima del proyecto: 16 semanas | Tiempo | El PMV debe estar completado y etiquetado como v1.0.0 al finalizar la semana 16 |
| R02 | Stack tecnológico obligatorio: MERN | Técnica | El sistema debe desarrollarse con MongoDB, Express.js, React y Node.js según lo establecido en la consigna |
| R03 | Límite de créditos por estudiante: mínimo 12, máximo 25 | Negocio | El sistema debe validar que ningún estudiante se matricule fuera de este rango por período |
| R04 | Arquitectura obligatoria: SPA + API REST | Técnica | El frontend debe ser una Single Page Application y el backend debe exponer una API REST |
| R05 | Control de versiones obligatorio: Git con Trunk-Based Development | Metodológica | El equipo debe usar el flujo Trunk-Based Development con ramas de feature de corta duración |
| R06 | Versionado semántico obligatorio: el PMV debe etiquetarse como v1.0.0 | Técnica | Todas las versiones intermedias deben seguir el esquema MAJOR.MINOR.PATCH |
| R07 | Documentación en formato Markdown en carpeta `docs/` | Metodológica | Toda la documentación debe estar en formato .md y organizada según la estructura PMBOK |
| R08 | Equipo de 3 integrantes sin posibilidad de incorporar nuevos miembros | Recursos | El proyecto debe ejecutarse con exactamente 3 personas durante todo el ciclo |
| R09 | El video demostrativo no puede exceder 5 minutos | Comunicación | El video final del PMV debe demostrar las funcionalidades clave en máximo 5 minutos |
| R10 | Sin integración con sistemas externos en el PMV | Alcance | No se permite conectar con plataformas de terceros (SGA, Intranet, APIs externas) en la versión v1.0.0 |

---

## 3. Restricciones del problema complejo (CSP)

Estas restricciones son propias del dominio del problema y deben ser implementadas en el algoritmo de generación de horarios:

| # | Restricción del dominio | Tipo | Prioridad |
|---|---|---|---|
| RC01 | Un docente no puede dictar dos cursos en el mismo bloque horario | Dura | Alta |
| RC02 | Un aula no puede ser asignada a dos grupos distintos en el mismo bloque horario | Dura | Alta |
| RC03 | Un estudiante no puede tener dos cursos en el mismo bloque horario | Dura | Alta |
| RC04 | El estudiante debe haber aprobado los prerrequisitos para matricularse en un curso | Dura | Alta |
| RC05 | El total de créditos matriculados debe estar entre 12 y 25 | Dura | Alta |
| RC06 | La capacidad del aula no puede ser superada por el número de estudiantes matriculados | Dura | Media |
| RC07 | El docente solo puede dictar en sus franjas horarias de disponibilidad registradas | Dura | Alta |
| RC08 | Los bloques horarios deben respetar el calendario académico del período | Dura | Media |

---

## 4. Ambigüedades identificadas en la consigna

Durante el análisis del problema se identificaron las siguientes ambigüedades que el equipo deberá resolver mediante supuestos justificados:

| # | Ambigüedad | Supuesto adoptado | Justificación |
|---|---|---|---|
| A01 | No se especifica la duración de cada bloque horario | Se asume bloques de 2 horas académicas (90 minutos) como unidad mínima | Es el estándar más común en universidades peruanas |
| A02 | No se define el número máximo de grupos por curso | Se asume máximo 3 grupos por curso en el PMV | Limita la complejidad del espacio de búsqueda del CSP |
| A03 | No se especifica si los prerrequisitos son estrictamente secuenciales o pueden tomarse de forma paralela | Se asume prerrequisitos estrictamente secuenciales (debe aprobarse antes de matricular el siguiente) | Refleja la política más común en currículos universitarios |
| A04 | No se indica cómo se maneja el caso en que no exista solución válida al CSP | El sistema deberá informar al coordinador qué restricciones generan el conflicto sin solución | Permite al usuario tomar decisiones informadas |
| A05 | No se define si la disponibilidad del docente es por día o por bloque horario específico | Se asume disponibilidad por bloque horario específico (día + franja) para mayor precisión | Reduce ambigüedad en la asignación y mejora la calidad del horario generado |

---

*Documento elaborado en el marco del Sprint 0 – Inicio del Proyecto.*  
*Los supuestos deberán revisarse al inicio de cada sprint y actualizarse si las condiciones cambian.*
