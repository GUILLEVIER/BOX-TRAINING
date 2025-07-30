# Requerimientos Detallados - Sistema de Agendamiento Box Training

## Información General del Proyecto

### Descripción

Aplicación web frontend desarrollada en Angular para la gestión y agendamiento de horarios de clases en un box de entrenamiento. El sistema maneja diferentes tipos de planes (Personalizado, CrossFit, Zumba) y permite la administración completa de horarios, planes y reservas.

### Roles de Usuario

- **Administrador del Sistema**: Gestión completa de planes y horarios
- **Alumno**: Visualización y agendamiento de clases según su plan activo

---

## Funcionalidades del Administrador

### 1. Gestión de Planes

#### 1.1 Crear Plan

**Descripción**: Permite crear nuevos planes de entrenamiento con configuraciones específicas.

**Criterios de Aceptación**:

- Formulario con validaciones obligatorias
- Campos requeridos: Nombre del Plan, Tipo de Plan, Descripción
- Selección múltiple de horarios disponibles
- Configuración de duración del plan (días/meses)
- Definición de número máximo de clases por período
- Precio del plan
- Estado del plan (Activo/Inactivo)

**Validaciones**:

- Nombre del plan único
- Al menos un horario debe ser seleccionado
- Duración mayor a 0
- Precio mayor o igual a 0

#### 1.2 Editar Plan

**Descripción**: Modificar planes existentes manteniendo la integridad de los alumnos activos.

**Criterios de Aceptación**:

- Cargar datos existentes del plan
- Permitir modificación de todos los campos excepto el tipo de plan si hay alumnos activos
- Mostrar advertencia si hay alumnos con el plan activo
- Validar que los cambios no afecten negativamente a usuarios activos

#### 1.3 Eliminar Plan

**Descripción**: Eliminar planes que no tengan alumnos activos asociados.

**Criterios de Aceptación**:

- Verificar que no existan alumnos con el plan activo
- Mostrar confirmación antes de eliminar
- Soft delete para mantener historial
- Mostrar mensaje de error si hay dependencias

#### 1.4 Activar Plan a Alumno

**Descripción**: Asignar un plan específico a un alumno.

**Criterios de Aceptación**:

- Buscador de alumnos por nombre/email/documento
- Selección de plan disponible
- Configuración de fecha de inicio
- Cálculo automático de fecha de vencimiento
- Definición de número de clases incluidas
- Desactivación automática de plan anterior si existe

#### 1.5 Congelar Plan del Alumno

**Descripción**: Suspender temporalmente el plan de un alumno.

**Criterios de Aceptación**:

- Búsqueda del alumno con plan activo
- Selección de período de congelamiento
- Extensión automática de fecha de vencimiento
- Cancelación automática de clases agendadas durante el período
- Notificación al alumno sobre el congelamiento

#### 1.6 Anular Plan del Alumno

**Descripción**: Cancelar definitivamente el plan de un alumno.

**Criterios de Aceptación**:

- Confirmación de anulación con motivo
- Cancelación de todas las clases futuras agendadas
- Liberación de cupos para otros alumnos
- Registro de motivo de anulación
- Notificación al alumno

### 2. Gestión de Horarios

#### 2.1 Disponibilizar Horarios al Plan

**Descripción**: Asignar horarios específicos a cada tipo de plan.

**Criterios de Aceptación**:

- Selección de plan existente
- Calendario semanal para seleccionar horarios
- Definición de capacidad máxima por horario
- Asignación de instructor
- Configuración de duración de la clase
- Vista previa de horarios asignados

---

## Funcionalidades del Alumno

### 1. Dashboard Personal

#### 1.1 Información del Plan Activo

**Descripción**: Mostrar información completa del plan actual del alumno.

**Criterios de Aceptación**:

- Nombre del plan activo
- Fecha de inicio y vencimiento
- Días restantes hasta el vencimiento
- Indicador visual de estado (Activo/Por vencer/Vencido)
- Descripción del plan
- Beneficios incluidos

#### 1.2 Contador de Clases

**Descripción**: Mostrar estadísticas de uso de clases.

**Criterios de Aceptación**:

- **Clases Disponibles**: Número de clases restantes en el plan
- **Clases Agendadas Futuras**: Clases reservadas para fechas posteriores
- **Historial de Clases**: Clases tomadas en el pasado con fechas
- Gráfico de progreso visual
- Filtros por período (último mes, últimos 3 meses, etc.)

### 2. Visualización de Horarios

#### 2.1 Catálogo de Horarios

**Descripción**: Mostrar todos los horarios disponibles en el box.

**Criterios de Aceptación**:

- Vista de calendario semanal/mensual
- Filtros por tipo de plan (Personalizado, CrossFit, Zumba)
- Filtros por día de la semana
- Filtros por horario (mañana, tarde, noche)
- Indicador visual de disponibilidad de cupos
- Resaltado de horarios disponibles para el plan del alumno

#### 2.2 Detalle de Horario

**Descripción**: Información detallada de cada clase.

**Criterios de Aceptación**:

- Información del instructor
- Lista de alumnos agendados (nombre y apellido)
- Capacidad total vs ocupada
- Duración de la clase
- Descripción de la actividad
- Ubicación/sala
- Botón de agendamiento (solo si corresponde al plan)

### 3. Gestión de Reservas

#### 3.1 Agendar Clase

**Descripción**: Reservar cupo en horarios disponibles del plan.

**Criterios de Aceptación**:

- Solo mostrar horarios del plan activo del alumno
- Verificar disponibilidad de cupos
- Verificar que el alumno tenga clases disponibles
- Confirmación de agendamiento
- Actualización automática de contadores
- Prevenir doble agendamiento en el mismo horario

#### 3.2 Cancelar Clase Agendada

**Descripción**: Cancelar reserva de clase futura.

**Criterios de Aceptación**:

- Lista de clases agendadas futuras
- Confirmación de cancelación
- Políticas de cancelación (tiempo mínimo antes de la clase)
- Liberación automática del cupo
- Recuperación de clase al contador disponible
- Notificación a lista de espera si existe

### 4. Sistema de Notificaciones

#### 4.1 Notificación de Cupo Liberado

**Descripción**: Avisar cuando se libera un cupo en clase con capacidad máxima.

**Criterios de Aceptación**:

- Sistema de lista de espera automática
- Notificación en tiempo real (push notification)
- Tiempo limitado para tomar el cupo liberado
- Prioridad por orden de solicitud
- Notificación por email/SMS

#### 4.2 Recordatorios

**Descripción**: Recordatorios automáticos de clases agendadas.

**Criterios de Aceptación**:

- Recordatorio 24 horas antes
- Recordatorio 2 horas antes
- Recordatorio de vencimiento de plan (7 días antes)
- Configuración personalizable de recordatorios

---

## Estructura de Datos

### Plan

```typescript
interface Plan {
  id: string;
  nombre: string;
  tipo: "PERSONALIZADO" | "CROSSFIT" | "ZUMBA";
  descripcion: string;
  duracionDias: number;
  numeroClases: number;
  precio: number;
  estado: "ACTIVO" | "INACTIVO";
  horariosDisponibles: string[]; // IDs de horarios
  fechaCreacion: Date;
  fechaModificacion: Date;
}
```

### Horario

```typescript
interface Horario {
  id: string;
  diaSemana: number; // 0-6 (Domingo-Sábado)
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  capacidadMaxima: number;
  instructorId: string;
  tipoClase: "PERSONALIZADO" | "CROSSFIT" | "ZUMBA";
  salon: string;
  descripcion: string;
}
```

### PlanAlumno

```typescript
interface PlanAlumno {
  id: string;
  alumnoId: string;
  planId: string;
  fechaInicio: Date;
  fechaVencimiento: Date;
  clasesRestantes: number;
  estado: "ACTIVO" | "CONGELADO" | "ANULADO" | "VENCIDO";
  motivoAnulacion?: string;
  fechasCongelamiento?: { inicio: Date; fin: Date }[];
}
```

### Reserva

```typescript
interface Reserva {
  id: string;
  alumnoId: string;
  horarioId: string;
  fecha: Date;
  estado: "AGENDADA" | "CANCELADA" | "COMPLETADA" | "NO_ASISTIO";
  fechaReserva: Date;
  fechaCancelacion?: Date;
}
```

### Alumno

```typescript
interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  fechaNacimiento: Date;
  fechaRegistro: Date;
  estado: "ACTIVO" | "INACTIVO";
}
```

### Instructor

```typescript
interface Instructor {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidades: string[];
  biografia: string;
  foto?: string;
  estado: "ACTIVO" | "INACTIVO";
}
```

### Notificacion

```typescript
interface Notificacion {
  id: string;
  alumnoId: string;
  tipo: "CUPO_LIBERADO" | "RECORDATORIO" | "PLAN_VENCIMIENTO" | "CANCELACION";
  titulo: string;
  mensaje: string;
  fechaCreacion: Date;
  fechaEnvio?: Date;
  leida: boolean;
  accionRequerida?: boolean;
}
```

---

## Consideraciones Técnicas

### Tecnologías

- **Framework**: Angular 16+
- **UI Library**: Angular Material o PrimeNG
- **Estado**: NgRx (para gestión de estado compleja)
- **HTTP Client**: Angular HttpClient
- **Autenticación**: JWT
- **Notificaciones**: PWA Push Notifications
- **Calendario**: FullCalendar Angular
- **Formularios**: Angular Reactive Forms
- **Validaciones**: Custom Validators

### Arquitectura

- Arquitectura basada en módulos feature
- Lazy loading para optimización
- Guards para protección de rutas
- Interceptors para manejo de errores y autenticación
- Services para lógica de negocio
- Resolvers para pre-carga de datos
- Shared module para componentes reutilizables

### Estructura de Módulos

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── services/
│   │   └── models/
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   └── directives/
│   ├── features/
│   │   ├── admin/
│   │   │   ├── planes/
│   │   │   ├── horarios/
│   │   │   └── alumnos/
│   │   ├── alumno/
│   │   │   ├── dashboard/
│   │   │   ├── horarios/
│   │   │   └── reservas/
│   │   └── auth/
│   └── layout/
```

### Responsive Design

- Mobile-first approach
- Breakpoints estándar (xs, sm, md, lg, xl)
- Navegación adaptativa
- Touch-friendly para dispositivos móviles
- Menús colapsables en mobile

### Performance

- OnPush change detection strategy
- TrackBy functions en listas
- Lazy loading de imágenes
- Paginación en listas largas
- Caché inteligente de datos
- Virtual scrolling para listas grandes

### Accesibilidad

- ARIA labels
- Navegación por teclado
- Contraste de colores adecuado
- Screen reader support
- Focus management
- Semantic HTML

### Seguridad

- Sanitización de datos
- Validación en frontend y backend
- HTTPS obligatorio
- JWT con expiración
- Rate limiting en APIs
- Validación de roles y permisos

### Testing

- Unit tests con Jasmine/Karma
- Integration tests
- E2E tests con Cypress
- Coverage mínimo del 80%
- Tests de accesibilidad

---

## Flujos de Usuario

### Flujo Administrador - Crear Plan

1. Login como administrador
2. Navegar a "Gestión de Planes"
3. Hacer clic en "Crear Nuevo Plan"
4. Completar formulario con datos del plan
6. Guardar plan
7. Confirmación de creación exitosa

### Flujo Alumno - Agendar Clase

1. Login como alumno
2. Ver dashboard con información del plan
3. Navegar a "Horarios Disponibles"
4. Filtrar por tipo de clase
5. Seleccionar horario deseado
6. Ver detalles de la clase
7. Confirmar agendamiento
8. Recibir confirmación

### Flujo Alumno - Cancelar Clase

1. Navegar a "Mis Reservas"
2. Ver lista de clases agendadas
3. Seleccionar clase a cancelar
4. Confirmar cancelación
5. Recibir confirmación
6. Actualización automática de contadores

---

## Wireframes y Diseño

### Pantallas Principales

1. **Dashboard Administrador**

   - Resumen de estadísticas
   - Accesos rápidos a funciones principales
   - Notificaciones importantes

2. **Dashboard Alumno**

   - Información del plan activo
   - Contadores de clases
   - Próximas clases agendadas
   - Accesos rápidos

3. **Calendario de Horarios**

   - Vista semanal/mensual
   - Filtros laterales
   - Indicadores de disponibilidad
   - Modal de detalles

4. **Gestión de Planes (Admin)**
   - Lista de planes existentes
   - Formularios de creación/edición
   - Asignación de horarios

### Componentes Reutilizables

- Calendar component
- Modal component
- Loading component
- Error boundary component
- Notification component
- Search component
- Filter component

---

## Roadmap de Desarrollo

### Fase 1 - Funcionalidades Básicas (4 semanas)

- Autenticación y autorización
- Gestión básica de planes
- Dashboard alumno
- Agendamiento básico

### Fase 2 - Funcionalidades Avanzadas (3 semanas)

- Sistema de notificaciones
- Gestión completa de horarios
- Congelamiento y anulación de planes
- Filtros avanzados

### Fase 3 - Optimización y PWA (2 semanas)

- Performance optimization
- PWA capabilities
- Push notifications
- Offline support

### Fase 4 - Testing y Deploy (1 semana)

- Testing completo
- Bug fixes
- Deployment
- Documentación

---

## Criterios de Finalización

### Criterios Técnicos

- Todos los tests pasan
- Coverage de código > 80%
- Performance score > 90
- Accesibilidad score > 90
- Sin vulnerabilidades críticas

### Criterios Funcionales

- Todas las funcionalidades implementadas
- Flujos de usuario validados
- Responsive design funcionando
- Notificaciones operativas
- Integración con backend completa

### Criterios de Calidad

- Code review aprobado
- Documentación completa
- Manual de usuario creado
- Training al cliente realizado
- Ambiente de producción configurado
