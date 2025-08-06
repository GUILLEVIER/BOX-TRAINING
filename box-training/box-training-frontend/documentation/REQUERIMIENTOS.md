# Requerimientos Detallados - Sistema de Agendamiento Box Training

## Información General del Proyecto

### Descripción

Aplicación web frontend desarrollada en Angular para la gestión y agendamiento de horarios de clases en un box de entrenamiento. El sistema maneja diferentes tipos de planes (Personalizado, CrossFit, Zumba, etc) y permite la administración completa de horarios, planes y reservas.

### Roles de Usuario

- **Administrador del Sistema**: Gestión completa de planes y horarios
- **Alumno**: Visualización y agendamiento de clases según su plan activo

## Funcionalidades del Administrador

### 1. Gestión de Planes

#### 1.0 Crear Tipos de Plan

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
- Tipo de Plan puede ser de 1 a varios.
- Configuración de duración del plan (días/meses).
- Definición de número máximo de clases por período.
- Documentos asignados al Tipo de Plan (En caso de ser ONLINE).
- Espacio de subida de documentos (En caso de ser ONLINE).
- Descripción del Plan.
- Imágen del Plan Caracteristico.
- Precio del plan.

**Validaciones**:

- Nombre del plan único
- Duración mayor a 0
- Precio mayor o igual a 0

#### 1.2 Editar Plan

**Descripción**: Modificar planes existentes manteniendo la integridad de los alumnos activos.

**Criterios de Aceptación**:

- Cargar datos existentes del plan.
- Permitir modificación de todos los campos excepto el tipo de plan si hay alumnos activos.
- Mostrar advertencia si hay alumnos con el plan activo.
- Validar que los cambios no afecten negativamente a usuarios activos.
- Permitir modificar imagenes al Plan.
- Permitir modificar documentos del Plan.

#### 1.3 Eliminar Plan

**Descripción**: Eliminar planes que no tengan alumnos activos asociados.

**Criterios de Aceptación**:

- Verificar que no existan alumnos con el plan activo.
- Mostrar confirmación antes de eliminar.
- Soft delete para mantener historial.
- Mostrar mensaje de error si hay dependencias.

#### 1.4 Duplicar Plan (Tabla y Detalle)

- Duplicar la información de un Plan.
- Duplicarlo en estado Inactivo.
- No puede existir un Plan con un mismo nombre.
- Agregar un numeral al final del nombre del Plan duplicado, por ejemplo: Si el nombre es Plan CrossFit Básico, el nuevo nombre del plan duplicado seria el siguiente: Plan CrossFit Básico 2. En caso de que ya existe el Plan CrossFit Básico 2, debería ser Plan CrossFit Básico 3, y así sucesivamente.
- Esta acción se debe realizar en la Sección de Gestión de Planes, en la tabla en donde se visualizan los Planes, y al presionar los 3 puntos en el lado derecho, se abren Opciones y entre ella se encuentra Duplicar Plan.
- Luego de presionar Duplicar Plan, se visualizará en la Tabla.

#### 1.5 Activar/Desactivar Plan (Tabla y Detalle)

#### 1.6 Visualizar el detalle de un Plan

- Filtrar por nombre del Plan.
- Seleccionar Plan.
- Ingresar al detalle del Plan.
- Tenga opción de Eliminar.
- Tenga opción de Editar.
- Tenga opción de Activar/Desactivar.

### 2. Gestión de Alumnos

#### 2.0 Listar Alumnos

- Titulo: Gestión de Alumnos.
- Botones de acceso rápido: + Crear Alumno.
- Filtro: Buscar Alumnos / Plan Inscrito / Estado del Alumno (Activo / Inactivo).
- Tabla: Nombre Alumno / Plan Inscrito / Estado / Acciones.
- Acciones: Ver detalles / Editar alumno / Desactivar o Activar / Eliminar Alumno

#### 2.1 Crear Alumno

- Flujo: Ir a Gestión de Estudiantes -> Clickear en Crear Alumno -> Redirección al componente de students-create.component.
- Titulo: Crear Nuevo Alumno.
- Información Básica: Información del Alumno / Imagen del Alumno (Opcional)
- Información del Alumno: firstName, lastName, email, phone, birthDate (Interface Student)
- Agregar a la Interface Student, el campo de Imagen del Alumno (photo)
- Botón de Guardado.

#### 2.2 Visualizar el detalle del Alumno

- Tenga opción de Eliminar.
- Tenga opción de Editar.
- Tenga opción de Activar/Desactivar alumno.
- Tenga opción de Activar/Desactivar el Plan.
- Tenga opción de Congelar Plan del alumno.
- Tenga opción de Anular Plan del alumno.
- Para Activar el Plan a Alumno:
  - Selección del plan.
  - Configuración de fecha de inicio.
  - Cálculo automático de fecha de vencimiento.
  - Mostrar el detalle del Plan Asignado a Alumno.
  - Tener en cuenta que el Alumno, via otra aplicación, hizo compra de un Plan, por lo tanto, en este punto, tiene asignado un Plan.
  - Tener en cuenta que el Alumno, no pudo hacer la compra de un Plan, sino que también debe tener la opción de asignarle un Plan para que luego realice el pago del plan asignado, y luego de eso, se le puede activar el Plan. Siempre y cuando el plan asignado se encuentra en estado Pagado.
  - El plan asignado a Alumno, posee estados: pendiente de pago, pagado, activo, desactivado.
- Para Congelar el Plan a Alumno:
  - Selección de período de congelamiento (Días de Congelamiento).
  - Extensión automática de fecha de vencimiento.
- Para Anular el Plan del Alumno:
  - Confirmación de anulación con motivo.
  - Registro de motivo de anulación.
  - Independiente del estado en que se encuentre el plan asignado a Alumno.

#### 2.3 Editar Alumno

**Descripción**: Modificar información básica del Alumno.

**Criterios de Aceptación**:

- Cargar datos existentes del Alumno.
- Información Básica: Información del Alumno / Imagen del Alumno (Opcional)
- Información del Alumno: firstName, lastName, email, phone, birthDate (Interface Student)
- Permitir modificación de todos los campos perteneciente al Alumno.
- Permitir modificar imagen del Alumno.

### 3. Gestión de Instructores

#### 3.0 Listar Instructores

- Titulo: Gestión de Instructores.
- Botones de acceso rápido: + Crear Instructor.
- Filtro: Buscar Instructor / Estado del Instructor (Activo / Inactivo).
- Tabla: Nombre Instructor / Especialidades / Estado / Acciones.
- Acciones: Ver detalles / Editar instructor / Desactivar o Activar / Eliminar Instructor

#### 3.1 Crear Instructor

- Flujo: Ir a Gestión de Instructor -> Clickear en Crear Instructor -> Redirección al componente de instructor-create.component.
- Titulo: Crear Nuevo Instructor.
- Información Básica: Información del Instructor / Imagen del Instructor (Opcional)
- Información del Instructor: firstName, lastName, email, phone, specialties, biography, etc (Interface Instructor)
- Botón de Guardado.

#### 3.2 Visualizar el detalle del Instructor

- Tenga opción de Eliminar.
- Tenga opción de Editar.
- Tenga opción de Activar/Desactivar instructor.

#### 2.3 Editar Instructor

**Descripción**: Modificar información básica del Instructor.

**Criterios de Aceptación**:

- Cargar datos existentes del Instructor.
- Información Básica: Información del Instructor / Imagen del Instructor (Opcional)
- Información del Instructor: firstName, lastName, email, phone, specialties, biography, etc (Interface Instructor)
- Permitir modificación de todos los campos perteneciente al Instructor.
- Permitir modificar imagen del Instructor.

### 2. Gestión de Horarios

#### 2.1 Disponibilizar Horarios

**Descripción**: Asignar horarios.

**Criterios de Aceptación**:

- Seleccionar un Rango de Fechas para disponibilizar horarios.
- Los horarios corresponden desde las 06:00 hrs a las 20:00 hrs.
- Cada bloque es de 1 hr cada uno.
- Dentro del bloque, si no existe una clase para ese horario se debe visualizar un botón que permita crear una clase.
- Para crear una clase se abrira un modal, y mostrará input de los siguientes parametros:
  - Selección de tipo plan existente: CROSSFIT, PERSONALIZADO, ZUMBA, ETC.
  - Definición de capacidad máxima de alumnos por horario.
  - Selección del Instructor que va a impartir la clase.
  - Lugar en donde se va a realizar la clase.
  - Horario de la clase: Por ejemplo: 06:00 - 07:00
- Botón de Crear Clase.
- Luego de Crear Clase, cerrar el Modal y se debe visualizar en el horario.

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
