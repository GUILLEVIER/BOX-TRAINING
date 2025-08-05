# Funcionalidad de Duplicar Plan - Resumen de Implementación

## Descripción

Se implementó la funcionalidad para duplicar planes en la sección de Gestión de Planes del sistema BOX-TRAINING.

## Características Implementadas

### 1. **Acceso a la Funcionalidad**

- Disponible en la tabla de gestión de planes
- Accesible a través del menú de 3 puntos (menu actions) en cada fila
- Opción "Duplicar Plan" con icono `content_copy`

### 2. **Lógica de Duplicación**

- **Estado**: El plan duplicado se crea en estado `INACTIVE`
- **Nombre único**: Se genera automáticamente agregando un numeral al final
- **Validación de nombres**: No permite planes con nombres duplicados

### 3. **Generación de Nombres Únicos**

- Si el plan original es "Plan CrossFit Básico", el duplicado será "Plan CrossFit Básico 2"
- Si ya existe "Plan CrossFit Básico 2", será "Plan CrossFit Básico 3"
- Y así sucesivamente hasta encontrar un nombre único

### 4. **Confirmación de Usuario**

- Diálogo de confirmación antes de duplicar
- Mensaje claro indicando que el plan se creará en estado inactivo

## Archivos Modificados

### 1. **PlansService** (`src/app/core/services/plans.service.ts`)

```typescript
// Nuevo método agregado
duplicatePlan(id: string): Observable<ApiResponse<Plan>>
generateUniquePlanName(originalName: string, existingPlans: Plan[]): string
```

### 2. **MockDataService** (`src/app/core/services/mock-data.service.ts`)

```typescript
// Método modificado para respetar el estado pasado
addPlan(plan: Omit<Plan, 'id' | 'creationDate' | 'lastModifiedDate'>): Plan
```

### 3. **PlansManagementComponent** (`src/app/features/admin/plans/management/plans-management.component.ts`)

```typescript
// Método actualizado con implementación completa
duplicatePlan(plan: Plan): void
```

### 4. **Plan Model** (`src/app/core/models/plan.model.ts`)

```typescript
// Interface agregada (ya existía)
export interface DuplicatePlanDto {
  id: string
  newName: string
}
```

## Flujo de Usuario

1. **Acceso**: El usuario accede a la tabla de gestión de planes
2. **Selección**: Hace clic en los 3 puntos de un plan específico
3. **Opción**: Selecciona "Duplicar Plan" del menú desplegable
4. **Confirmación**: Se muestra un diálogo de confirmación
5. **Procesamiento**: Si confirma, el sistema:
   - Genera un nombre único para el plan
   - Copia todos los datos del plan original
   - Establece el estado como INACTIVE
   - Crea el nuevo plan en la base de datos
6. **Resultado**: Se muestra un mensaje de éxito y la tabla se actualiza

## Validaciones Implementadas

### 1. **Validación de Existencia**

- Verifica que el plan a duplicar existe
- Manejo de errores si el plan no se encuentra

### 2. **Validación de Nombres Únicos**

- Algoritmo para generar nombres únicos automáticamente
- Verificación contra todos los planes existentes

### 3. **Validación de Estado**

- El plan duplicado siempre se crea en estado INACTIVE
- Preserva todos los demás datos del plan original

## Mensajes al Usuario

### Éxito

- "Plan '[Nombre Original]' duplicado exitosamente como '[Nombre Nuevo]'"

### Error

- "Plan no encontrado"
- "Error al duplicar el plan"

## Consideraciones Técnicas

### 1. **Copia Profunda de Datos**

- Se realiza copia profunda de arrays (type, documents, images)
- Preserva la integridad de los datos originales

### 2. **Gestión de Estado**

- Loading states durante el proceso de duplicación
- Actualización automática de la tabla después de la duplicación

### 3. **Observables y Reactive Programming**

- Uso de RxJS para manejo asíncrono
- Proper error handling con try-catch en observables

## Próximos Pasos

1. **Testing**: Implementar tests unitarios para la funcionalidad
2. **Optimización**: Considerar implementación en backend real
3. **UX**: Agregar animaciones para mejor experiencia de usuario
4. **Logs**: Implementar logging detallado para auditoría

## Notas de Desarrollo

- La implementación utiliza el MockDataService actual
- Compatible con el sistema de componentes reutilizables existente
- Sigue los patrones de diseño establecidos en el proyecto
- Mantiene consistencia con el resto de la aplicación
