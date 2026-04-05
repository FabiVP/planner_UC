# Documento Inicial del Problema — Primer Borrador

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Universidad:** Universidad Continental  
**Fecha:** Marzo 2026  
**Versión:** 0.1 (primer borrador — sujeto a refinamiento)

---

## 1. Descripción del problema central

Las universidades que operan bajo un modelo de **currículo flexible** enfrentan una problemática estructural en la planificación de horarios académicos. A diferencia de los currículos rígidos donde los horarios son fijos y preestablecidos, el currículo flexible permite a cada estudiante construir su propia carga académica seleccionando cursos de distintos ciclos, lo que genera una **alta variabilidad en la combinación de cursos, docentes y aulas** necesaria para cada período.

Este escenario introduce una complejidad combinatoria significativa: dado un conjunto de cursos disponibles, docentes con disponibilidades distintas, aulas con capacidades y tipos diferenciados, y estudiantes con historiales académicos heterogéneos, se debe encontrar una **asignación válida** que satisfaga simultáneamente múltiples restricciones interdependientes sin generar conflictos.

Actualmente, este proceso se realiza de forma **manual o semiautomática** mediante hojas de cálculo, generando los siguientes problemas evidenciables:

- Conflictos de horarios no detectados hasta después de publicada la programación.
- Asignación de cursos a estudiantes que no cumplen prerrequisitos.
- Sobreasignación o subutilización de aulas.
- Tiempo elevado dedicado por los coordinadores académicos a la planificación.
- Dificultad para incorporar cambios de último momento (docente que no puede en un horario, aula no disponible, etc.).

---

## 2. Naturaleza del problema como problema complejo de ingeniería

Este problema cumple con los criterios de un **problema complejo de ingeniería** (ABET/ACCREDITATION) por las siguientes razones:

| Característica | Evidencia en el problema |
|---|---|
| Múltiples variables interdependientes | Cursos, docentes, estudiantes, aulas y franjas horarias se interrelacionan de forma no trivial |
| Restricciones contradictorias o en tensión | La disponibilidad de un docente puede entrar en conflicto con la disponibilidad del aula requerida para su curso |
| No existe solución única o trivial | El espacio de soluciones es combinatorio; existen múltiples horarios válidos y ninguno "óptimo" por defecto |
| Requerimientos parcialmente definidos | La consigna no especifica la duración de bloques, número máximo de grupos por curso, ni la política exacta de prerrequisitos paralelos |
| Participación de múltiples actores | Estudiantes, docentes, coordinadores y administradores tienen intereses y necesidades distintas |
| Impacto real en contexto organizacional | Una mala planificación afecta directamente la calidad educativa y la eficiencia administrativa universitaria |
| Necesidad de modelado abstracto | El problema debe formularse como un CSP para ser abordado computacionalmente |

---

## 3. Modelado inicial del problema como CSP

### 3.1 Variables del problema

| Variable | Descripción | Dominio |
|---|---|---|
| `asignacion[i]` | Bloque horario asignado al curso `i` | Conjunto de franjas (día, hora_inicio) disponibles |
| `aula[i]` | Aula asignada al curso `i` | Conjunto de aulas compatibles con el tipo de curso |
| `docente[i]` | Docente asignado al curso `i` | Conjunto de docentes disponibles para el curso |
| `grupo[i]` | Número de grupo del curso `i` | {1, 2, 3} (máximo 3 grupos por curso, supuesto S02) |

### 3.2 Restricciones del problema

**Restricciones duras (deben satisfacerse obligatoriamente):**

| # | Restricción | Expresión informal |
|---|---|---|
| C1 | No solapamiento de docente | `∀ i ≠ j: docente[i] = docente[j] → asignacion[i] ≠ asignacion[j]` |
| C2 | No solapamiento de aula | `∀ i ≠ j: aula[i] = aula[j] → asignacion[i] ≠ asignacion[j]` |
| C3 | No solapamiento de estudiante | Un estudiante no puede estar matriculado en dos cursos con el mismo bloque horario |
| C4 | Prerrequisitos | Un estudiante solo puede matricularse si ha aprobado los cursos prerrequisito del curso elegido |
| C5 | Límite de créditos | `12 ≤ Σ créditos_cursos_matriculados[estudiante] ≤ 25` |
| C6 | Disponibilidad del docente | `asignacion[i]` debe estar dentro de las franjas disponibles de `docente[i]` |
| C7 | Capacidad del aula | `num_estudiantes_matriculados[i] ≤ capacidad[aula[i]]` |

**Restricciones blandas (deseables pero no bloqueantes):**

- Distribuir los cursos del estudiante a lo largo de la semana (evitar sobrecarga en un día).
- Preferir aulas con capacidad ajustada al número de matriculados (eficiencia de recursos).

### 3.3 Actores (stakeholders)

| Actor | Rol en el sistema | Restricciones que genera |
|---|---|---|
| Estudiante | Selecciona cursos a matricular | C3, C4, C5 |
| Docente | Define su disponibilidad horaria | C1, C6 |
| Coordinador académico | Gestiona la programación y resuelve conflictos | Todas |
| Administrador del sistema | Configura entidades y parámetros del sistema | N/A (configuración) |
| Infraestructura (aulas) | Recurso físico asignado a cada curso | C2, C7 |

---

## 4. Ambigüedades y vacíos de información identificados

Durante el análisis inicial se identificaron las siguientes ambigüedades que requieren decisión del equipo:

1. **Duración de los bloques horarios:** La consigna no define si los bloques son de 1 hora, 1.5 horas o 2 horas. *Impacto:* Afecta la granularidad del dominio de la variable `asignacion[i]`.

2. **Número máximo de grupos por curso:** No se especifica cuántos grupos paralelos puede tener un mismo curso. *Impacto:* Amplía o reduce el espacio de soluciones del CSP.

3. **Política de prerrequisitos en paralelo:** ¿Puede un estudiante matricularse en un curso y su prerrequisito simultáneamente si aún no ha aprobado el prerrequisito? *Impacto:* Define si la restricción C4 es estricta o flexible.

4. **Comportamiento ante ausencia de solución:** Si el CSP no tiene solución (por ejemplo, todos los docentes disponibles para un curso tienen conflicto con las aulas necesarias), ¿qué debe hacer el sistema? *Impacto:* Afecta el diseño de la interfaz y la lógica de manejo de errores.

5. **Definición de "disponibilidad" del docente:** ¿Se registra por día de la semana o por franja horaria específica (día + hora)? *Impacto:* Afecta el dominio de la variable `asignacion[i]` y el diseño del modelo de datos.

---

## 5. Árbol del problema

```
PROBLEMA CENTRAL
└── Planificación manual e ineficiente de horarios académicos en currículo flexible
    │
    ├── CAUSAS
    │   ├── Alta variabilidad en la selección de cursos por estudiante
    │   ├── Múltiples restricciones interdependientes no modeladas formalmente
    │   ├── Ausencia de herramientas especializadas para el contexto
    │   └── Proceso manual propenso a errores humanos
    │
    └── EFECTOS
        ├── Conflictos de horarios entre docentes, aulas y estudiantes
        ├── Incumplimiento de prerrequisitos no detectado a tiempo
        ├── Sobrecarga administrativa del coordinador académico
        ├── Insatisfacción estudiantil y docente
        └── Ineficiencia en el uso de recursos físicos (aulas)
```

---

## 6. Solución propuesta (resumen)

**UniScheduler** aborda este problema mediante:

1. Un **modelo de datos estructurado** que representa fielmente las entidades del dominio: estudiantes, docentes, cursos, aulas y sus restricciones.
2. Un **algoritmo CSP con backtracking + heurística MRV** que genera automáticamente horarios válidos respetando todas las restricciones duras definidas.
3. Una **interfaz web** (React SPA) que permite al coordinador visualizar, revisar y gestionar los horarios generados, con alertas claras ante conflictos.
4. Una **API REST** (Express + Node.js) que separa la lógica de negocio de la presentación y facilita la mantenibilidad y escalabilidad futura del sistema.

---

*Este es el primer borrador del documento de análisis del problema.*  
*Será refinado a lo largo del Sprint 1 conforme el equipo profundice en el levantamiento de requerimientos.*
