# Requerimientos Detallados - Sistema de Agendamiento Box Training

## Información General del Proyecto

### Descripción

Aplicación web frontend desarrollada en Angular para la gestión y agendamiento de horarios de clases en un box de entrenamiento. El sistema maneja diferentes tipos de planes (Personalizado, CrossFit, Zumba, etc) y permite la administración completa de horarios, planes y reservas.

### Roles de Usuario

- **Administrador del Sistema**: Gestión completa de planes y horarios
- **Alumno**: Visualización y agendamiento de clases según su plan activo

## Funcionalidades del Administrador

### 1. Gestión de Planes

#### 1.0 Crear Tipos de Plan (LISTO)

**Descripción**: Permite crear nuevos tipos de planes de entrenamientos.

**Criterios de Aceptación**:

- Formulario con validaciones obligatorias.
- Selector de Tipo de formato (ONLINE, PRESENCIAL).
- Ingreso del Nombre del Tipo de Plan (ZUMBA, CROSSFIT, PERSONALIZADO, BOX LIBRE, FUNCIONAL, ETC).

#### 1.1 Crear Plan

**Descripción**: Permite crear nuevos planes de entrenamiento con configuraciones específicas.

**Criterios de Aceptación**:

- Formulario con validaciones obligatorias.
- Campos requeridos: Nombre del Plan, Tipo de Plan, Descripción, etc.
- Configuración de duración del plan (días/meses).
- Definición de número máximo de clases por período.
- Documentos asignados al Tipo de Plan (En caso de ser ONLINE).
- Espacio de subida de documentos (En caso de ser ONLINE).
- Descripción del Tipo de Plan.
- Imágen del Tipo de Plan Caracteristico.
- Precio del plan.

**Validaciones**:

- Nombre del plan único
- Duración mayor a 0
- Precio mayor o igual a 0

#### 1.2 Editar Plan

**Descripción**: Modificar planes existentes manteniendo la integridad de los alumnos activos.

**Criterios de Aceptación**:

- Cargar datos existentes del plan
- Permitir modificación de todos los campos excepto el tipo de plan si hay alumnos activos
- Mostrar advertencia si hay alumnos con el plan activo
- Validar que los cambios no afecten negativamente a usuarios activos
- Permitir modificar imagenes al Plan
- Permitir modificar documentos del Plan

#### 1.3 Eliminar Plan

**Descripción**: Eliminar planes que no tengan alumnos activos asociados.

**Criterios de Aceptación**:

- Verificar que no existan alumnos con el plan activo
- Mostrar confirmación antes de eliminar
- Soft delete para mantener historial
- Mostrar mensaje de error si hay dependencias

#### 1.4 Activar Plan a Alumno

**Descripción**: Activar el plan comprado a un alumno.

**Criterios de Aceptación**:

- Planes de alumnos pendientes de activar
- Buscador de alumnos por nombre/email
- Selección del plan
- Configuración de fecha de inicio
- Cálculo automático de fecha de vencimiento
- Definición de número de clases incluidas
- Desactivación automática de plan anterior si existe

#### 1.5 Congelar Plan del Alumno

**Descripción**: Suspender temporalmente el plan de un alumno.

**Criterios de Aceptación**:

- Congelamientos de Planes pendientes de realizar
- Búsqueda del alumno con plan activo por nombre/email
- Selección del plan
- Selección de período de congelamiento
- Extensión automática de fecha de vencimiento
- Cancelación automática de clases agendadas durante el período
- Notificación al alumno sobre el congelamiento

#### 1.6 Anular Plan del Alumno

**Descripción**: Cancelar definitivamente el plan de un alumno.

**Criterios de Aceptación**:

- Anulaciones de Planes pendientes de realizar
- Confirmación de anulación con motivo
- Cancelación de todas las clases futuras agendadas
- Liberación de cupos para otros alumnos
- Registro de motivo de anulación
- Notificación al alumno

#### 1.7 Gestionar Alumnos

- Visualizar Plan Activo.
- Visualizar Información Básica del Alumno.
- Visualizar Agendamientos futuros.
- Filtrar por Tipo de Plan.
- Filtrar por Nombre del Alumno.
- Visualizar Tabla de Alumnos.

#### 1.8 Duplicar Plan (Tabla y Detalle)

- Duplicar la información de un Plan.
- Duplicarlo en estado Inactivo.
- No puede existir un Plan con un mismo nombre.

#### 1.9 Activar/Desactivar Plan (Tabla y Detalle)

#### 1.10 Visualizar el detalle de un Plan

- Filtrar por nombre del Plan.
- Seleccionar Plan.
- Ingresar al detalle del Plan.
- Tenga opción de Eliminar.
- Tenga opción de Editar.
- Tenga opción de Activar/Desactivar.
- Tenga opción de Duplicar.
- Tenga opción de Visualizar Alumnos del Plan.

**Descripción**:

### 2. Gestión de Horarios

#### 2.1 Disponibilizar Horarios al tipo de Plan y por Instructor

**Descripción**: Asignar horarios específicos a cada tipo de plan (CROSSFIT, ZUMBA, PERSONALIZADO, ETC).

**Criterios de Aceptación**:

- Selección de tipo plan existente
- Calendario semanal para seleccionar horarios
- Definición de capacidad máxima por horario
- Asignación de instructor
- Configuración de duración de la clase

### 3. Gestión de Instructores

#### 3.1 Creación de Instructores

**Descripción**: Crear Instructor

**Criterios de Aceptación**:

- Campo Nombre.
- Campo Apellido.
- Campo Email.
- Campo Phone.
- Campo Especialidades.
- Campo Biografia.
- Campo Photo.

## Funcionalidades del Alumno

### 1. Dashboard Personal

#### 1.0 Visualizar el detalle del Plan Activo

- Botón de ir al detalle del Plan Activo.

#### 1.1 Información del Plan Activo

**Descripción**: Mostrar información completa del plan actual del alumno.

**Criterios de Aceptación**:

- Nombre del plan activo
- Fecha de inicio y vencimiento
- Días restantes hasta el vencimiento
- Indicador visual de estado (Activo/Por vencer/Vencido)
- Descripción del plan

#### 1.2 Contador de Clases

**Descripción**: Mostrar estadísticas de uso de clases.

**Criterios de Aceptación**:

- **Clases Disponibles**: Número de clases restantes en el plan
- **Clases Agendadas Futuras**: Clases reservadas para fechas posteriores
- **Historial de Clases**: Clases tomadas en el pasado con fechas
- Gráfico de progreso visual
- Filtros por período (último mes, últimos 3 meses, etc.)

#### 1.3 Solicitud de Congelamiento

**Descripción**: Solicitud de Congelamiento del plan.

**Criterios de Aceptación**:

- Ingresar al detalle del Plan Activo.
- Días/Meses requeridos para congelamiento.
- Ingresar la razón del Congelamiento del Plan.
- Botón de Solicitar Congelamiento del Plan.
- Aprobación del Administrador.

#### 1.4 Solicitud de Anulación

**Descripción**: Solicitud de Anulación del plan.

**Criterios de Aceptación**:

- Ingresar al detalle del Plan Activo.
- Ingresar la razón de la Anulación del plan.
- Botón de Solicitar Anulación del Plan.
- Aprobación del Administrador.

### 2. Visualización de Horarios

#### 2.1 Detalle de Horario

**Descripción**: Información detallada de cada clase.

**Criterios de Aceptación**:

- Información del instructor
- Lista de alumnos agendados (nombre y apellido)
- Capacidad total vs ocupada
- Duración de la clase
- Descripción de la actividad
- Ubicación/sala

### 3. Gestión de Reservas

#### 3.1 Agendar Clase

**Descripción**: Reservar cupo en horarios disponibles del plan.

**Criterios de Aceptación**:

- Solo mostrar horarios correspondientes a los tipos o tipo de plan activo del alumno (CROSSFIT, PERSONALIZADO, ZUMBA, ETC)
- Verificar disponibilidad de cupos
- Verificar que el alumno tenga clases disponibles
- Confirmación de agendamiento
- Actualización automática de contadores
- Prevenir doble agendamiento en el mismo horario

#### 3.2 Cancelar Clase Agendada

**Descripción**: Cancelar reserva de clase futura.

**Criterios de Aceptación**:

- Ir a Mis Reservas
- Listar clases agendadas futuras
- Confirmación de cancelación
- Políticas de cancelación (tiempo mínimo antes de la clase 1 hr)
- Liberación automática del cupo
- Recuperación de clase al contador disponible

### 4. Sistema de Notificaciones

#### 4.1 Notificación de Cupo Liberado

**Descripción**: Avisar cuando se libera un cupo en clase con capacidad máxima.

**Criterios de Aceptación**:

- Notificación en tiempo real (push notification)
- Solo para clases diarias Próximas.

#### 4.2 Recordatorios

**Descripción**: Recordatorios automáticos de clases agendadas.

**Criterios de Aceptación**:

- Recordatorio 24 horas antes
- Recordatorio 2 horas antes
- Recordatorio de vencimiento de plan (7 días antes)
- Configuración personalizable de recordatorios

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

### Componentes Reutilizables

- Calendar component
- Modal component
- Loading component
- Error boundary component
- Notification component
- Search component
- Filter component

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
