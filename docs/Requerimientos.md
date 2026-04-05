# Lista Preliminar de Requerimientos

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Universidad:** Universidad Continental  
**Fecha:** Marzo 2026  
**Versión:** 0.1 (preliminar — sujeto a refinamiento en Sprint 1)

---

## 1. Requerimientos Funcionales (RF)

Los requerimientos funcionales describen las capacidades que el sistema debe proveer. Se identificaron 10 requerimientos funcionales trazables al problema central.

| ID | Requerimiento | Actor principal | Prioridad | Trazabilidad |
|---|---|---|---|---|
| RF01 | El sistema debe permitir registrar, editar y eliminar estudiantes con su información académica (nombre, código, historial de cursos aprobados) | Administrador / Coordinador | Alta | Restricción C4 — prerrequisitos |
| RF02 | El sistema debe permitir registrar, editar y eliminar docentes con sus franjas de disponibilidad horaria (día + hora) | Administrador / Coordinador | Alta | Restricción C1, C6 |
| RF03 | El sistema debe permitir registrar, editar y eliminar cursos, incluyendo su nombre, código, número de créditos y lista de prerrequisitos | Administrador / Coordinador | Alta | Variables del CSP |
| RF04 | El sistema debe permitir registrar, editar y eliminar aulas, especificando su capacidad máxima y tipo (laboratorio, aula teórica, auditorio) | Administrador | Alta | Restricción C2, C7 |
| RF05 | El sistema debe validar la matrícula de un estudiante verificando que el total de créditos esté entre 12 y 25, y que se cumplan todos los prerrequisitos de los cursos seleccionados | Sistema / Estudiante | Alta | Restricciones C4, C5 |
| RF06 | El sistema debe generar automáticamente un horario académico válido aplicando el algoritmo CSP, respetando todas las restricciones duras definidas (sin solapamientos, disponibilidades y capacidades) | Coordinador | Alta | Todas las restricciones C1–C7 |
| RF07 | El sistema debe visualizar el horario generado en un formato de grid semanal (lunes a sábado, franjas horarias de 7:00 a 22:00) mostrando curso, docente y aula asignados | Estudiante / Coordinador / Docente | Alta | RF06 |
| RF08 | El sistema debe detectar y mostrar alertas cuando existan conflictos en la programación (solapamiento de docente, aula o estudiante) indicando los elementos en conflicto | Coordinador | Alta | Restricciones C1, C2, C3 |
| RF09 | El sistema debe permitir autenticación de usuarios con roles diferenciados: administrador, coordinador académico, docente y estudiante, restringiendo el acceso a funcionalidades según el rol | Todos los actores | Alta | Seguridad — ISO/IEC 25010 |
| RF10 | El sistema debe permitir exportar o imprimir el horario generado en un formato descargable (PDF o imagen) | Coordinador / Estudiante | Media | RF07 |
| RF11 | El sistema debe mostrar al coordinador un dashboard con resumen del estado de la planificación: cursos sin horario asignado, docentes con conflictos, aulas disponibles | Coordinador | Media | RF06, RF08 |
| RF12 | El sistema debe registrar la disponibilidad de cada docente por período académico, permitiendo actualización antes de cada proceso de generación de horarios | Administrador / Docente | Alta | Restricción C6 |

---

## 2. Requerimientos No Funcionales (RNF)

Los requerimientos no funcionales definen atributos de calidad del sistema. Se basan en el estándar ISO/IEC 25010.

| ID | Requerimiento | Atributo ISO/IEC 25010 | Métrica / Criterio de verificación | Prioridad |
|---|---|---|---|---|
| RNF01 | El sistema debe generar un horario para un período con hasta 30 cursos en un tiempo máximo de 10 segundos | Rendimiento (eficiencia temporal) | Tiempo de respuesta medido con prueba de carga básica | Alta |
| RNF02 | El sistema debe ser accesible desde los navegadores Chrome (v100+) y Firefox (v100+) sin degradación de funcionalidad | Portabilidad / Compatibilidad | Prueba manual en ambos navegadores | Alta |
| RNF03 | El sistema debe proteger las contraseñas de usuarios usando hashing bcrypt y comunicar datos sensibles mediante HTTPS | Seguridad (OWASP Top 10) | Revisión de código y prueba de autenticación | Alta |
| RNF04 | La API REST debe responder a cualquier endpoint en menos de 2 segundos bajo condiciones normales de uso | Rendimiento | Prueba con herramienta como Postman / Artillery | Media |
| RNF05 | El sistema debe ser mantenible: el código debe seguir una arquitectura por capas (routes → controllers → services → models) y estar documentado con JSDoc en funciones críticas | Mantenibilidad | Revisión de estructura del repositorio | Alta |
| RNF06 | La interfaz debe ser responsiva y funcional en pantallas de escritorio (≥1280px) y tablet (≥768px) | Usabilidad | Prueba visual en resoluciones definidas | Media |
| RNF07 | El sistema debe validar todas las entradas del usuario en el frontend y en el backend, evitando inyecciones y datos inválidos (OWASP A03:2021) | Seguridad | Prueba de validación con datos malformados | Alta |
| RNF08 | El código fuente debe superar el 70% de cobertura de pruebas en los módulos de validación de matrícula y generación de horarios | Confiabilidad | Reporte de cobertura con Jest | Alta |

---

## 3. Trazabilidad requerimientos — problema

La siguiente tabla muestra cómo cada requerimiento funcional se conecta con el problema central y sus componentes:

| Componente del problema | Requerimientos relacionados |
|---|---|
| Gestión de entidades del dominio | RF01, RF02, RF03, RF04, RF12 |
| Restricciones del CSP | RF05 (C4, C5), RF06 (C1–C7), RF08 (C1, C2, C3) |
| Interfaz y visualización | RF07, RF10, RF11 |
| Seguridad y acceso | RF09, RNF03, RNF07 |
| Rendimiento y calidad técnica | RNF01, RNF04, RNF05, RNF08 |
| Usabilidad y compatibilidad | RNF02, RNF06 |

---

## 4. Requerimientos pendientes de clarificación

Los siguientes requerimientos no pueden definirse completamente hasta resolver las ambigüedades identificadas en el documento del problema:

- **RF-P01:** Manejo del sistema ante ausencia de solución CSP (depende de A04 del registro de ambigüedades).
- **RF-P02:** Política de prerrequisitos en paralelo (depende de A03).
- **RF-P03:** Duración estándar de los bloques horarios (depende de A01).

Estos requerimientos serán refinados en el Sprint 1, previa consulta con el docente del curso.

---

*Lista preliminar elaborada en el marco del Sprint 0 – Inicio del Proyecto.*  
*Será actualizada y refinada en el Sprint 1 como parte del Product Backlog.*
