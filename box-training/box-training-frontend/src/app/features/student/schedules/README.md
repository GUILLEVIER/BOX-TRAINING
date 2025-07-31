# Student Schedules - Funcionalidad de Selección de Horarios por Rango de Fechas

## Descripción

Esta funcionalidad permite a los estudiantes seleccionar un rango de fechas y visualizar todos los horarios disponibles en formato de grilla, facilitando la reserva de múltiples clases de una forma más intuitiva.

## Componentes Creados

### 1. StudentSchedulesComponent

**Ubicación:** `/src/app/features/student/student-schedules/student-schedules.component.ts`
**Ruta:** `/schedules`

Componente principal que maneja:

- Selección de rango de fechas usando Material Date Range Picker
- Carga y filtrado de horarios basado en el plan del usuario
- Visualización en formato de grilla (días vs horarios)
- Selección múltiple de horarios
- Gestión del estado de reservas

#### Características principales:

- **Signals** para manejo reactivo del estado
- **Computed signals** para datos derivados (horarios filtrados por día)
- **Lazy loading** del diálogo de detalles
- **Validación** de fechas y plan del usuario
- **Simulación** de carga de datos (preparado para integración con backend)

### 2. ScheduleBlockComponent

**Ubicación:** `/src/app/features/student/student-schedules/schedule-block/schedule-block.component.ts`

Componente reutilizable para mostrar cada bloque de horario individual:

- Información básica del horario (tipo de clase, sala, capacidad)
- Estado visual (disponible/completo/seleccionado)
- Interacción mediante checkbox y clic
- Indicadores visuales de capacidad

### 3. ScheduleDetailDialogComponent

**Ubicación:** `/src/app/features/student/student-schedules/schedule-detail-dialog/schedule-detail-dialog.component.ts`

Diálogo modal que muestra información detallada:

- Datos completos del horario
- Información del instructor
- Lista de estudiantes ya reservados
- Opción de reserva directa desde el detalle

## Estructura de Datos

### ScheduleBlock

```typescript
interface ScheduleBlock extends Schedule {
  dayOfMonth: number // Día del mes específico
  available: boolean // Si está disponible para reserva
  currentReservations?: number // Número actual de reservas
  isSelected?: boolean // Si está seleccionado por el usuario
}
```

## Funcionalidades Principales

### 1. Selección de Rango de Fechas

- Date Range Picker de Material Angular
- Validación de fechas válidas
- Confirmación antes de buscar horarios

### 2. Visualización en Grilla

- Primera columna: horarios (6:00 AM - 8:00 PM)
- Columnas siguientes: días seleccionados
- Bloques de horario interactivos
- Indicadores de estado visual

### 3. Interacción con Horarios

- **Clic simple**: abre diálogo de detalles
- **Checkbox**: selecciona/deselecciona para reserva
- **Estados visuales**: disponible (verde), completo (rojo), seleccionado (azul)

### 4. Reserva de Horarios

- Selección múltiple de horarios
- Resumen de selecciones
- Proceso de reserva simulado
- Feedback visual durante el proceso

## Integración con el Sistema

### Rutas

Nueva ruta agregada en `student.routes.ts`:

```typescript
{
  path: 'schedules',
  loadComponent: () => import('./student-schedules/student-schedules.component')
    .then(c => c.StudentSchedulesComponent)
}
```

### Servicios Utilizados

- **AuthService**: obtener usuario actual
- **MockDataService**: datos del plan activo del usuario
- **SchedulesService**: horarios disponibles y utilidades
- **MatDialog**: gestión de diálogos modales
- **MatSnackBar**: mensajes de feedback

## Responsive Design

- Grilla adaptativa para diferentes tamaños de pantalla
- Scroll horizontal en dispositivos móviles
- Botones de acción sticky en la parte inferior

## Próximos Pasos para Integración Completa

1. **Backend Integration**:

   - Reemplazar simulaciones con llamadas HTTP reales
   - Implementar endpoints para horarios por rango de fechas
   - Gestión real de reservas

2. **Optimizaciones**:

   - Cache de horarios consultados
   - Paginación para rangos de fechas grandes
   - Optimización de rendimiento para grillas extensas

3. **Funcionalidades Adicionales**:
   - Filtros por tipo de clase
   - Vista de calendario alternativa
   - Notificaciones de cambios en horarios

## Uso

1. El usuario navega a `/schedules`
2. Selecciona un rango de fechas en el date picker
3. Hace clic en "Buscar Horarios"
4. Se muestra la grilla con todos los horarios disponibles
5. Puede hacer clic en cualquier bloque para ver detalles
6. Selecciona los horarios deseados usando los checkboxes
7. Confirma la reserva con el botón "Reservar Horarios"

La funcionalidad está completamente integrada con el sistema de theming de Angular Material y sigue las mejores prácticas de Angular 18+ con signals y componentes standalone.
