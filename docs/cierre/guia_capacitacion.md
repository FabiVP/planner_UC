# Guía de Capacitación — UniScheduler

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Versión:** 1.0.0
**Fecha:** Julio 2026

---

## 1. Introducción

Esta guía está diseñada para facilitar la transferencia de conocimiento al cliente (coordinadores académicos) y al equipo de operaciones que heredará el producto final. Incluye instrucciones paso a paso, capturas de pantalla referenciales y casos de uso típicos.

---

## 2. Requisitos del Sistema

### 2.1. Requisitos de Hardware

| Componente | Mínimo | Recomendado |
|---|---|---|
| Procesador | 2.0 GHz dual-core | 2.5 GHz quad-core |
| Memoria RAM | 4 GB | 8 GB |
| Almacenamiento | 500 MB libres | 1 GB libres |
| Conexión a Internet | 5 Mbps | 10 Mbps |

### 2.2. Requisitos de Software

- Navegador web moderno: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Node.js 18+ (solo para desarrollo local)
- MongoDB 6.0+ (solo para desarrollo local)

---

## 3. Acceso al Sistema

### 3.1. Acceso vía Web (Producción)

1. Abrir el navegador web
2. Navegar a la URL del sistema: [URL de producción]
3. Iniciar sesión con las credenciales proporcionadas

### 3.2. Acceso vía Local (Desarrollo/Pruebas)

```bash
# Clonar el repositorio
git clone https://github.com/.../planner_UC.git

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de MongoDB

# Iniciar backend y frontend
cd ../backend && npm run dev
cd ../frontend && npm run dev
```

---

## 4. Perfiles de Usuario

| Perfil | Acceso | Funcionalidades Disponibles |
|---|---|---|
| **Coordinador** | Completo | Gestión de entidades, validación matrícula, generación CSP, visualización |
| **Docente** | Consulta | Visualización de horario asignado, disponibilidad |
| **Estudiante** | Consulta | Selección de cursos, horario personalizado |

### Credenciales Predefinidas (Modo Demostración)

| Perfil | Email | Contraseña |
|---|---|---|
| Coordinador | `coordinador@test.com` | `coordinador123` |
| Docente | `docente@test.com` | `docente123` |
| Estudiante | `estudiante@test.com` | `estudiante123` |

---

## 5. Guía de Uso — Casos Típicos

### 5.1. Caso 1: Gestión de Entidades (Coordinador)

**Objetivo:** Registrar un nuevo curso en el sistema.

**Pasos:**

1. Iniciar sesión como **Coordinador**
2. Navegar a **Gestión → Cursos**
3. Hacer clic en **"Nuevo Curso"**
4. Completar los campos:
   - Código: `CS-401`
   - Nombre: `"Ingeniería de Software"`
   - Créditos: `4`
   - Tipo: `Teórico`
   - Prerrequisitos: (seleccionar de la lista)
   - Carrera: `Ingeniería de Sistemas`
5. Hacer clic en **"Guardar"**
6. Verificar que el curso aparece en el listado

### 5.2. Caso 2: Validación de Matrícula (Coordinador)

**Objetivo:** Validar la matrícula de un estudiante.

**Pasos:**

1. Navegar a **Matrícula → Validar**
2. Seleccionar el **estudiante** de la lista
3. Seleccionar los **cursos** que desea matricular
4. El sistema muestra automáticamente:
   - Total de créditos seleccionados
   - Estado de cada prerrequisito (✅ / ❌)
   - Validación de rango de créditos (12-25)
5. Si todo es válido, hacer clic en **"Confirmar Matrícula"**

### 5.3. Caso 3: Generación de Horario Institucional (Coordinador)

**Objetivo:** Generar el horario académico para el semestre.

**Pasos:**

1. Navegar a **Generación → Horario Institucional**
2. Verificar que todos los datos están cargados:
   - Cursos: ✅
   - Docentes: ✅
   - Aulas: ✅
   - Estudiantes matriculados: ✅
3. Hacer clic en **"Generar Horario"**
4. Esperar la confirmación (tiempo estimado: < 1 segundo)
5. Visualizar el horario generado en la grilla semanal
6. Si es necesario, hacer clic en **"Regenerar"** para obtener una nueva versión

### 5.4. Caso 4: Horario Personalizado del Estudiante

**Objetivo:** Generar el horario individual de un estudiante.

**Pasos:**

1. Iniciar sesión como **Estudiante**
2. Navegar a **Mi Horario**
3. El sistema muestra los cursos en los que está matriculado
4. Hacer clic en **"Generar mi Horario"**
5. El sistema presenta:
   - **Opción principal:** horario óptimo
   - **Alternativa 1:** variación del horario
   - **Alternativa 2:** segunda variación
6. Seleccionar la opción preferida y hacer clic en **"Confirmar"**

### 5.5. Caso 5: Visualización y Navegación

**Objetivo:** Explorar el horario generado.

**Pasos:**

1. La grilla semanal muestra: Lunes a Viernes, 07:00 - 22:00
2. Cada celda contiene: nombre del curso, código y aula
3. Los cursos están coloreados por materia (color consistente)
4. Navegación por teclado:
   - **TAB:** moverse entre celdas
   - **FLECHAS:** navegación dentro del grid
   - **ENTER:** ver detalle del curso
5. Los cursos con sesiones dobles aparecen en celdas fusionadas

---

## 6. Pantallas Principales (Descripción)

### 6.1. Dashboard

Métrica principal del sistema:
- Total de estudiantes, docentes, cursos y aulas registrados
- Horarios generados en el semestre
- Alertas y notificaciones

### 6.2. Gestión de Entidades

CRUD completo para:
- **Estudiantes:** código, nombre, email, carrera, semestre
- **Docentes:** código, nombre, email, especialidad, disponibilidad, tipo de contrato
- **Cursos:** código, nombre, créditos, tipo, prerrequisitos, carrera
- **Aulas:** código, capacidad, tipo, ubicación, disponibilidad

### 6.3. Generación de Horarios

Panel de control del motor CSP:
- Parámetros de generación (restricciones activas)
- Botón de generación con indicador de progreso
- Resultado: tiempo de generación, número de asignaciones, conflictos (0)

### 6.4. Grilla de Visualización

Grid interactivo con:
- Franjas horarias en filas (07:00 - 22:00, 15 franjas)
- Días de la semana en columnas (Lun - Vie)
- Celdas con información del curso
- Colores por materia
- Navegación por teclado y ratón

---

## 7. Resolución de Problemas Comunes

### 7.1. Error de Conexión

| Síntoma | Causa Posible | Solución |
|---|---|---|
| "Error de conexión al servidor" | Servidor backend caído | Verificar que el backend esté ejecutándose. `npm run dev` en `/backend` |
| "Error 401: No autorizado" | Sesión expirada | Cerrar sesión y volver a iniciar |
| Pantalla en blanco al cargar | Error en frontend | Limpiar caché del navegador (Ctrl+F5) |

### 7.2. Error en Generación de Horarios

| Síntoma | Causa Posible | Solución |
|---|---|---|
| "No se encontró una solución válida" | Restricciones imposibles de satisfacer | Verificar disponibilidad de docentes y aulas. Reducir restricciones |
| El horario tiene conflictos | Error en datos de entrada | Revisar que no haya docentes/aulas duplicados en los datos |
| La generación tarda más de 5 segundos | Volumen de datos muy grande | Reducir cantidad de cursos o estudiantes en la ejecución |

### 7.3. Problemas en Visualización

| Síntoma | Causa Posible | Solución |
|---|---|---|
| La grilla no se actualiza después de regenerar | Caché del navegador | Recargar la página (F5) |
| Los colores de los cursos son diferentes | Error de renderizado | Cerrar sesión y volver a iniciar |

---

## 8. Mantenimiento del Sistema

### 8.1. Tareas Periódicas

| Frecuencia | Tarea | Responsable |
|---|---|---|
| Diaria | Verificar que el servidor esté operativo | Operaciones |
| Semanal | Realizar backup de la base de datos | Operaciones |
| Mensual | Revisar logs de errores del servidor | Operaciones |
| Semestral | Actualizar datos de cursos, docentes y aulas | Coordinador |

### 8.2. Backup de Base de Datos

```bash
# Backup de MongoDB (local)
mongodump --db unischeduler --out ./backup/$(date +%Y-%m-%d)

# Backup de MongoDB Atlas
mongodump --uri="mongodb+srv://<user>:<password>@cluster.mongodb.net/unischeduler" --out ./backup/$(date +%Y-%m-%d)

# Restaurar backup
mongorestore --db unischeduler ./backup/2026-07-01/unischeduler
```

### 8.3. Actualización del Sistema

```bash
# Actualizar desde el repositorio
git pull origin main
npm install
npm run build
npm restart
```

---

## 9. Contacto y Soporte

| Canal | Información |
|---|---|
| Equipo de Desarrollo | [Correo del equipo] |
| Repositorio | https://github.com/.../planner_UC |
| Reporte de Issues | GitHub Issues del repositorio |

---

## 10. Video Demostrativo

El video demostrativo del sistema (≤ 5 minutos) está disponible en:
[Enlace al video]

El video cubre:
1. Inicio de sesión por roles
2. Gestión de entidades (CRUD)
3. Validación de matrícula
4. Generación de horario institucional (CSP)
5. Horario personalizado del estudiante
6. Visualización en grilla y navegación por teclado
7. Diseño responsivo

---

*Documento elaborado por el equipo UniScheduler — Sprint 5 | Universidad Continental | Julio 2026*
