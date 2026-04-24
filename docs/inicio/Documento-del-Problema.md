# Documento Inicial del Problema — Versión Final (Alineada)
**Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Institución:** Universidad Continental  
**Versión:** 1.0.0  
**Fecha:** Abril 2026  
**Estado:** Versión final alineada — consistente con documentos A, B, C, D, E, F y README

---

## 1. Descripción General del Problema

Las universidades con **currículo flexible** permiten a los estudiantes elegir libremente sus cursos dentro de un rango de créditos, avanzar a su propio ritmo y personalizar su trayectoria académica. Esta libertad, aunque pedagógicamente valiosa, introduce una complejidad operativa significativa: la **planificación de horarios académicos** se convierte en un problema combinatorio de alta dimensionalidad, donde coexisten múltiples variables, actores y restricciones interdependientes.

En la actualidad, la elaboración de horarios en estos contextos se realiza de forma **manual o semimanual**, apoyada en hojas de cálculo y el criterio del coordinador académico. Este proceso presenta los siguientes problemas concretos:

- Generación de **conflictos de asignación** (solapamientos de docentes, aulas o estudiantes).
- **Tiempo excesivo** de planificación: días o semanas de trabajo por semestre.
- **Errores humanos** difíciles de detectar en escenarios con decenas de cursos y cientos de estudiantes.
- **Falta de optimización**: los horarios resultantes no necesariamente aprovechan de forma eficiente los recursos disponibles (aulas, franjas horarias, carga docente).
- **Dificultad de adaptación** ante cambios: la incorporación o eliminación de un curso obliga a revisar manualmente toda la planificación.

No existe, en el contexto descrito, una solución única ni trivial. El problema requiere un **enfoque basado en modelado formal, análisis sistémico y toma de decisiones fundamentadas**, propio de los problemas complejos de ingeniería de software.

---

## 2. Definición Formal del Problema

El problema de generación de horarios académicos en entornos de currículo flexible puede formalizarse como un **Problema de Satisfacción de Restricciones (CSP — Constraint Satisfaction Problem)** y, en su versión extendida, como un **problema de optimización combinatoria**.

### 2.1. Definición CSP

Un CSP se define como una tupla `(X, D, C)` donde:

- **X** = conjunto de variables del problema.
- **D** = dominios de cada variable (conjunto de valores posibles).
- **C** = conjunto de restricciones que deben satisfacerse.

Aplicado al problema:
X = { (curso_i, docente_j, aula_k, franja_t) | i ∈ Cursos, j ∈ Docentes, k ∈ Aulas, t ∈ Franjas }

D(curso_i) = conjunto de cursos disponibles en el semestre
D(docente_j) = conjunto de docentes con disponibilidad declarada
D(aula_k) = conjunto de aulas del tipo requerido por el curso
D(franja_t) = conjunto de franjas horarias disponibles (lunes–sábado, mañana/tarde/noche)

C = { RD-01, RD-02, RD-03, RD-04, RD-05, RD-06 } (ver sección 4.1)


Una **solución válida** es una asignación completa de valores a todas las variables que satisface simultáneamente todas las restricciones en `C`.

### 2.2. Naturaleza del Problema Complejo

Este problema califica como **problema complejo de ingeniería** porque:

| Característica | Evidencia en el problema |
|---|---|
| Múltiples variables interdependientes | Cursos, docentes, aulas, estudiantes y franjas interactúan simultáneamente |
| Ausencia de solución única o trivial | Existen miles de combinaciones posibles; no todas son válidas |
| Necesidad de modelado abstracto | Requiere formalización matemática (CSP) para ser tratable computacionalmente |
| Participación de múltiples actores | Estudiantes, docentes, coordinadores y administradores con intereses distintos |
| Impacto en contexto real | Afecta directamente la experiencia académica de cientos de personas |
| Enfoque interdisciplinario | Combina ingeniería de software, algoritmos, gestión de proyectos y análisis de sistemas |

---

## 3. Variables del Problema

| Variable | Descripción | Tipo |
|---|---|---|
| **Cursos** | Conjunto de asignaturas a programar en el semestre (código, nombre, créditos, tipo, prerrequisitos) | Discreta |
| **Docentes** | Conjunto de profesores disponibles (disponibilidad horaria, cursos que puede dictar, máximo de horas) | Discreta |
| **Estudiantes** | Conjunto de alumnos matriculados (cursos seleccionados, créditos acumulados, prerrequisitos aprobados) | Discreta |
| **Aulas** | Conjunto de espacios físicos (capacidad, tipo: teórica / laboratorio, disponibilidad por franja) | Discreta |
| **Franjas horarias** | Bloques de tiempo disponibles (día de semana × turno × hora de inicio y fin) | Discreta |
| **Asignaciones** | Variable de decisión: qué docente dicta qué curso, en qué aula y en qué franja | Combinatoria |

---

## 4. Restricciones del Sistema

### 4.1. Restricciones Duras (Hard Constraints)
*Deben cumplirse obligatoriamente. Su violación invalida la solución.*

**Nota de trazabilidad:** Los IDs `RD-xx` son consistentes con el documento `D_supuestos_y_restricciones.md` (sección 3.6).

| ID (cruzado con D_supuestos) | Restricción | Descripción formal | Impacto si no se cumple |
|---|---|---|---|
| **RD-01** | No solapamiento de docente | `∀ c1, c2: if horario(c1) = horario(c2) then docente(c1) ≠ docente(c2)` | Horario inválido (conflicto de persona) |
| **RD-02** | No solapamiento de aula | `∀ c1, c2: if horario(c1) = horario(c2) then aula(c1) ≠ aula(c2)` | Horario inválido (doble reserva) |
| **RD-03** | No solapamiento de estudiante | `∀ estudiante e, cursos c1, c2 en su matrícula: horario(c1) ≠ horario(c2)` | Estudiante no puede asistir a dos clases |
| **RD-04** | Límite de créditos | `20 ≤ Σ créditos(cursos_matriculados(e)) ≤ 22` | Incumplimiento normativa académica |
| **RD-05** | Prerrequisitos | `∀ curso c tomado por e: todos los prerrequisitos de c están aprobados en semestres previos` | Estudiante cursa sin base conceptual |
| **RD-06** | Tipo de infraestructura | `tipo_aula(curso) = tipo_aula(asignada)` | Clase teórica en laboratorio (ineficiencia) |

### 4.2. Restricciones Blandas (Soft Constraints)
*Se optimizan en la medida de lo posible pero no invalidan la solución si no se cumplen.*

| ID | Restricción | Descripción |
|---|---|---|
| **SC-01** | Preferencia horaria de docentes | Asignar franjas preferidas por los docentes cuando sea posible |
| **SC-02** | Distribución equilibrada de carga | Evitar que un docente tenga clases consecutivas excesivas |
| **SC-03** | Compactación de horario estudiantil | Minimizar tiempos muertos en el horario semanal de cada estudiante |
| **SC-04** | Equidad de turno | Distribuir cursos de alta demanda en distintos turnos (mañana/tarde/noche) |

---

## 5. Actores del Sistema (Stakeholders)

### 5.1. Mapa de Stakeholders


### 5.2. Descripción de Stakeholders

| Actor | Rol | Necesidades | Interés en el sistema |
|---|---|---|---|
| **Coordinador Académico** | Usuario principal / decisor | Generar horarios válidos, sin conflictos y en poco tiempo | Alto — usa el sistema directamente para planificar |
| **Estudiante** | Usuario final / beneficiario | Visualizar su horario personalizado; verificar prerrequisitos y créditos | Alto — el horario afecta directamente su vida académica |
| **Docente** | Usuario final / actor restringido | Que su disponibilidad sea respetada; no tener conflictos de asignación | Medio — valida sus asignaciones en el sistema |
| **Administrador del sistema** | Operador técnico | Gestionar usuarios, roles, cursos y aulas en el sistema | Alto — mantiene los datos base del sistema |
| **Directivo / Decanato** | Interesado indirecto | Eficiencia en el uso de recursos institucionales | Bajo — recibe reportes de alto nivel |

---

## 6. Análisis de Ambigüedades del Problema

Las siguientes ambigüedades fueron identificadas en la consigna y en el dominio del problema. Deben resolverse durante los sprints de análisis.

| ID | Ambigüedad | Descripción | Decisión tomada o pendiente | Relación con objetivos |
|---|---|---|---|---|
| **AMB-01** | Definición de "horario óptimo" | La consigna menciona "generación óptima" pero no define el criterio de optimización | **Pendiente:** definir función objetivo en Sprint 1 | OE-02 (modelar como CSP) |
| **AMB-02** | Capacidad de estudiantes por aula | No se especifica si la capacidad del aula debe coincidir exactamente con el número de estudiantes matriculados | **Supuesto adoptado (SA-01 en D_supuestos):** capacidad del aula ≥ número de matriculados | OE-04 (implementar sistema funcional) |
| **AMB-03** | Duración de las franjas horarias | No se define la duración estándar de un bloque de clase | **Pendiente:** levantar con el coordinador o asumir 90 minutos | OE-01 (analizar el problema) |
| **AMB-04** | Número máximo de cursos por docente | La consigna no lo especifica explícitamente | **Supuesto adoptado (SA-02 en D_supuestos):** máximo 3 cursos por docente por semestre | OE-02 (modelar como CSP) |
| **AMB-05** | Rol del estudiante en la generación | No queda claro si el estudiante ingresa manualmente los cursos deseados o si el sistema los sugiere | **Pendiente:** definir flujo de matrícula en Sprint 2 | RF-02, RF-03 (requerimientos funcionales) |
| **AMB-06** | Criterio de "validez" de un horario | ¿Un horario es válido solo si todas las restricciones duras se satisfacen, o también deben satisfacerse algunas blandas? | **Decisión adoptada:** válido = todas las HC (RD-01 a RD-06) satisfechas; las SC son de optimización | OE-05 (calidad según ISO 25010) |

---

## 7. Análisis de Factibilidad Preliminar

### 7.1. Factibilidad Técnica

| Aspecto | Evaluación | Justificación |
|---|---|---|
| **Algoritmo CSP** | Alta | Los CSP con backtracking y técnicas de poda (arc-consistency, forward checking, MRV) son computacionalmente tratables para el tamaño esperado del problema (50–100 cursos). Ver `enfoque_del_proyecto.md`. |
| **Stack MERN** | Alta | Maduro, con amplia documentación y comunidad; adecuado para construir el PMV en 12 semanas. |
| **Equipo** | Media-Alta | Habilidades suficientes en JavaScript/React/Node; curva de aprendizaje manejable en MongoDB y algoritmos CSP. Ver `declaracion_equipo.md`. |

### 7.2. Factibilidad Económica

| Aspecto | Evaluación | Justificación |
|---|---|---|
| **Costo de herramientas** | $0 | Uso exclusivo de herramientas gratuitas (MongoDB Atlas Free, Vercel, Render, GitHub Free). Ver `project_charter.md` sección 8. |
| **Costo de infraestructura** | $0 | Durante el período de desarrollo y evaluación académica. |

### 7.3. Factibilidad Temporal

| Aspecto | Evaluación | Justificación |
|---|---|---|
| **Duración del proyecto** | 12 semanas | Suficiente para construir un PMV funcional con las 4 funcionalidades core. Ver `project_charter.md` sección 6. |
| **Complejidad del algoritmo** | Gestionable | El CSP simplificado (solo restricciones duras RD-01 a RD-06) es implementable en Sprint 3 (3 semanas). |
| **Riesgo temporal** | Medio | El mayor riesgo es la implementación del motor CSP; se mitiga iniciando investigación desde Sprint 0. |

---

## 8. Impacto del Problema

### 8.1. Impacto Técnico
La ausencia de un sistema automatizado obliga a los coordinadores a resolver manualmente un problema **NP-difícil** (equivalente a Graph Coloring), con alta probabilidad de errores y suboptimalidad. La implementación de un motor CSP permite abordar sistemáticamente esta complejidad.

### 8.2. Impacto Social
Los errores en la planificación de horarios afectan directamente a los estudiantes (conflictos en su horario, incapacidad de matricularse en cursos deseados) y a los docentes (asignaciones que no respetan su disponibilidad). El sistema propuesto busca **equidad** en la asignación (ver `B_vision_del_proyecto.md`, sección 3.2).

### 8.3. Impacto Organizacional
Una planificación ineficiente subutiliza los recursos de la universidad (aulas vacías, docentes con carga desequilibrada) y genera retrabajos costosos en tiempo del personal administrativo. La automatización reduce estos costos ocultos.

### 8.4. Impacto Ambiental (Green Software)
Un motor de generación eficiente, que minimice iteraciones computacionales innecesarias mediante heurísticas de poda (MRV, Forward Checking), contribuye a la reducción del consumo energético de los servidores donde se ejecute el sistema. Este enfoque está alineado con el estándar **Green Software** declarado en `enfoque_del_proyecto.md` (sección 5).

---

## 9. Conclusión del Análisis

El problema de generación óptima de horarios académicos en entornos de currículo flexible es un **problema complejo de ingeniería de software** que:

- **No tiene solución única:** existen múltiples asignaciones posibles, no todas válidas ni óptimas.
- **Requiere modelado formal:** su formalización como CSP (ver sección 2.1) permite abordarlo de manera sistemática y computacionalmente tratable.
- **Impacta a múltiples actores:** estudiantes, docentes, coordinadores y la institución en su conjunto.
- **Puede resolverse con tecnología accesible:** el stack MERN y los algoritmos CSP con backtracking ofrecen una solución viable dentro de las restricciones del proyecto.

Este documento establece la base analítica sobre la cual se construirán los modelos, requerimientos y decisiones de diseño en los sprints subsiguientes.

---

## 10. Relación con otros documentos del Sprint 0

Este documento es parte de la documentación base del proyecto. Para una visión completa y consistente, consultar los siguientes artefactos:

| Documento | Propósito | Vínculo con este documento |
| :--- | :--- | :--- |
| `enfoque_del_proyecto.md` | Justificación de Scrum y MERN | Amplía la sección 7 (factibilidad técnica) |
| `vision_del_proyecto.md` | Declaración FOR y propuesta de valor | Complementa la sección 5 (stakeholders) |
| `project_charter.md` | Alcance, objetivos y riesgos | Alinea la sección 8 (impacto) y sección 7 (factibilidad temporal) |
| `supuestos_y_restricciones.md` | Restricciones formales del CSP | **Cruzado directamente con sección 4.1** (RD-01 a RD-06) |
| `declaracion_equipo.md` | Roles y matriz RACI | Relacionado con la sección 7.1 (habilidades del equipo) |
| `requerimientos_funcionales_no_funcionales.md` | RF y RNF con SMART / ARC42 | Complementa la sección 2 (definición CSP) y sección 4 |
| `README.md` | Punto de entrada central | Visión general del proyecto y TOC para navegación |

> **Nota de consistencia documental:** Las restricciones `RD-01` a `RD-06` definidas en `supuestos_y_restricciones.md` (sección 3.6) son las mismas que las presentadas en la sección 4.1 de este documento. Se ha unificado la nomenclatura para garantizar trazabilidad entre todos los artefactos del Sprint 0.

---

## 11. Referencias

- Russell, S. & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. — Capítulo 6: Constraint Satisfaction Problems.
- ISO/IEC 25010:2011. *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE).*
- OWASP Foundation. (2021). *OWASP Top Ten.* https://owasp.org/www-project-top-ten/
- Universidad Continental. (2026). *Consigna PFA — Sistema de Generación Óptima de Horarios Académicos.* Taller de Proyectos 2.
- ACM. (2020). *Green Software Engineering.* https://greensoftware.foundation/

---

*Documento elaborado por el equipo del PFA — Sprint 0 | Universidad Continental | Abril 2026*  
*Estado: Versión final alineada — consistente con A, B, C, D, E, F y README*