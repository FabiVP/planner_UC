# Spec.md - Especificación Formal del Sistema

**Feature:** Generación Óptima de Horarios Académicos  
**Versión:** 1.0.0  
**Fecha:** Abril 2026  

---

## Entradas del Sistema

### 1. Entidades Base

| Entidad | Atributos | Formato |
|---------|-----------|---------|
| **Curso** | nombre, créditos (1-5), prerrequisitos (lista IDs), docente (ID), tipo_aula | texto, número, array de strings, string |
| **Estudiante** | nombre, cursos_aprobados (lista IDs), cursos_a_matricular (lista IDs) | texto, array de strings |
| **Docente** | nombre, disponibilidad (días/horas) | texto, objeto horario |
| **Aula** | nombre, capacidad (número), tipo (teórica/laboratorio) | texto, número, string |

### 2. Configuración Horaria

| Parámetro | Valores |
|-----------|---------|
| Días | lunes, martes, miércoles, jueves, viernes, sábado |
| Turnos | mañana (08:00-12:00), tarde (14:00-18:00), noche (19:00-22:00) |
| Franjas totales | 6 días × 3 turnos = 18 franjas por semana |

---

## Salidas del Sistema

### 1. Horario Semanal (Formato JSON)

```json
{
  "horarios": [
    {
      "curso_id": "CUR-101",
      "curso_nombre": "Matemáticas",
      "docente": "Juan Pérez",
      "aula": "A-101",
      "dia": "lunes",
      "turno": "mañana"
    }
  ],
  "estadisticas": {
    "tiempo_generacion_segundos": 0.597,
    "conflictos_resueltos": 0,
    "solucion_completa": true
  }
}