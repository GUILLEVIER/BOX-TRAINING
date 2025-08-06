# 📏 Guía de Estilos: REM vs PX en Box Training

## 📏 **REM vs PX: Cuándo usar cada uno**

### 🎯 **Usar REM para:**

#### **1. Tipografía y Espaciado Relacionado con Texto**

```scss
// ✅ RECOMENDADO: REM
font-size: 1.125rem; // 18px (si root = 16px)
line-height: 1.5rem; // 24px
margin-bottom: 1rem; // 16px - espaciado entre párrafos
padding: 0.75rem 1rem; // 12px 16px - padding de botones
```

#### **2. Márgenes y Paddings de Componentes**

```scss
// ✅ RECOMENDADO: REM para espaciado de componentes
.card {
  padding: 1.5rem; // 24px - se escala con accesibilidad
  margin-bottom: 2rem; // 32px - consistente con tamaño de texto
}

.section {
  margin-top: 3rem; // 48px - espaciado entre secciones
  padding: 2rem 1rem; // 32px 16px
}
```

### 🎯 **Usar PX para:**

#### **1. Bordes y Líneas Finas**

```scss
// ✅ RECOMENDADO: PX
border: 1px solid #ccc; // Siempre debe ser 1px físico
border-radius: 8px; // Valores específicos de diseño
box-shadow: 0 2px 4px; // Efectos visuales precisos
```

#### **2. Iconos y Elementos Pequeños**

```scss
// ✅ RECOMENDADO: PX
.icon {
  width: 24px; // Tamaño específico del icono
  height: 24px;
}

.divider {
  height: 1px; // Línea divisoria
  background: #eee;
}
```

## 📊 **Tabla de Mejores Prácticas**

| **Uso**                 | **Unidad** | **Razón**                        | **Ejemplo**             |
| ----------------------- | ---------- | -------------------------------- | ----------------------- |
| **Márgenes y Paddings** | **REM**    | Escalabilidad y accesibilidad    | `padding: 1rem`         |
| **Tipografía**          | **REM**    | Respeta preferencias del usuario | `font-size: 1.125rem`   |
| **Bordes**              | **PX**     | Precisión visual                 | `border: 1px solid`     |
| **Sombras**             | **PX**     | Efectos específicos              | `box-shadow: 0 2px 4px` |
| **Iconos pequeños**     | **PX**     | Tamaño exacto                    | `width: 24px`           |
| **Border-radius**       | **PX**     | Diseño específico                | `border-radius: 8px`    |

## ✅ **Ventajas de REM:**

1. **Accesibilidad**: Se adapta si el usuario cambia el tamaño de fuente
2. **Escalabilidad**: Mantiene proporciones visuales
3. **Consistencia**: Espaciado coherente en toda la app
4. **Responsive**: Se adapta mejor a diferentes dispositivos

## ✅ **Ventajas de PX:**

1. **Precisión**: Control exacto del tamaño
2. **Bordes**: Líneas siempre nítidas (1px)
3. **Iconos**: Tamaños específicos sin distorsión
4. **Efectos**: Sombras y decoraciones precisas

## 🔧 **Sistema de Espaciado de Box Training**

### 📐 **Espaciado Base (REM)**

```scss
// Márgenes generales
.margin-8 {
  margin: 0.5rem !important;
} // 8px
.margin-16 {
  margin: 1rem !important;
} // 16px
.margin-24 {
  margin: 1.5rem !important;
} // 24px
.margin-32 {
  margin: 2rem !important;
} // 32px

// Paddings generales
.padding-8 {
  padding: 0.5rem !important;
} // 8px
.padding-16 {
  padding: 1rem !important;
} // 16px
.padding-24 {
  padding: 1.5rem !important;
} // 24px
.padding-32 {
  padding: 2rem !important;
} // 32px
```

### 📍 **Espaciado Direccional (REM)**

```scss
// Márgenes específicos
.mt-1 {
  margin-top: 0.5rem !important;
} // 8px
.mt-2 {
  margin-top: 1rem !important;
} // 16px
.mt-3 {
  margin-top: 1.5rem !important;
} // 24px
.mt-4 {
  margin-top: 2rem !important;
} // 32px

.mb-1 {
  margin-bottom: 0.5rem !important;
} // 8px
.mb-2 {
  margin-bottom: 1rem !important;
} // 16px
.mb-3 {
  margin-bottom: 1.5rem !important;
} // 24px
.mb-4 {
  margin-bottom: 2rem !important;
} // 32px

// Paddings específicos
.pt-1 {
  padding-top: 0.5rem !important;
} // 8px
.pt-2 {
  padding-top: 1rem !important;
} // 16px
.pt-3 {
  padding-top: 1.5rem !important;
} // 24px
.pt-4 {
  padding-top: 2rem !important;
} // 32px

.pb-1 {
  padding-bottom: 0.5rem !important;
} // 8px
.pb-2 {
  padding-bottom: 1rem !important;
} // 16px
.pb-3 {
  padding-bottom: 1.5rem !important;
} // 24px
.pb-4 {
  padding-bottom: 2rem !important;
} // 32px
```

### 🎨 **Tipografía Escalable (REM)**

```scss
.text-xs {
  font-size: 0.75rem;
} // 12px
.text-sm {
  font-size: 0.875rem;
} // 14px
.text-base {
  font-size: 1rem;
} // 16px
.text-lg {
  font-size: 1.125rem;
} // 18px
.text-xl {
  font-size: 1.25rem;
} // 20px
.text-2xl {
  font-size: 1.5rem;
} // 24px
.text-3xl {
  font-size: 1.875rem;
} // 30px
```

### 📏 **Dimensiones de Componentes (REM)**

```scss
// Alturas
.h-8 {
  height: 2rem;
} // 32px
.h-10 {
  height: 2.5rem;
} // 40px
.h-12 {
  height: 3rem;
} // 48px
.h-16 {
  height: 4rem;
} // 64px

// Anchos
.w-8 {
  width: 2rem;
} // 32px
.w-10 {
  width: 2.5rem;
} // 40px
.w-12 {
  width: 3rem;
} // 48px
.w-16 {
  width: 4rem;
} // 64px
```

### 🔗 **Gaps para Flexbox/Grid (REM)**

```scss
.gap-1 {
  gap: 0.25rem;
} // 4px
.gap-2 {
  gap: 0.5rem;
} // 8px
.gap-3 {
  gap: 0.75rem;
} // 12px
.gap-4 {
  gap: 1rem;
} // 16px
.gap-6 {
  gap: 1.5rem;
} // 24px
.gap-8 {
  gap: 2rem;
} // 32px
```

### 🎯 **Bordes y Efectos (PX)**

```scss
// Bordes redondeados
.rounded {
  border-radius: 8px !important;
}
.rounded-lg {
  border-radius: 12px !important;
}
.rounded-xl {
  border-radius: 16px !important;
}
.rounded-full {
  border-radius: 50% !important;
}

// Sombras
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12) !important;
}
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12) !important;
}
.shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}
.shadow-xl {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}
```

## 🎨 **Customizaciones Angular Material**

### 📦 **Cards - Mezcla de REM y PX**

```scss
.mat-mdc-card {
  border-radius: 12px !important; // PX para diseño específico
  padding: 1.5rem !important; // REM para escalabilidad
}
```

### 🔘 **Botones - Mezcla de REM y PX**

```scss
.mat-mdc-button {
  border-radius: 8px !important; // PX para bordes
  padding: 0.5rem 1rem !important; // REM para espaciado interno
  min-height: 2.5rem !important; // REM para altura mínima
}

.mat-mdc-raised-button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12) !important; // PX para sombras
}

.mat-mdc-raised-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16) !important; // PX para efectos
}
```

## 🎨 **Recomendaciones para Box Training**

### 📱 **Componentes PWA**

1. **Banner de instalación**:

   - `padding: 1rem` (escalable)
   - `border-radius: 8px` (preciso)

2. **Cards de contenido**:

   - `padding: 1.5rem` (escalable)
   - `margin-bottom: 2rem` (escalable)
   - `border-radius: 12px` (preciso)

3. **Botones**:
   - `padding: 0.5rem 1rem` (escalable)
   - `min-height: 2.5rem` (escalable)
   - `border-radius: 8px` (preciso)

### 🏋️ **Componentes de Gimnasio**

1. **Stats Cards**:

   - `padding: 1.5rem` (espaciado consistente)
   - `gap: 1rem` (separación entre elementos)

2. **Schedules**:

   - `margin-bottom: 1rem` (separación entre horarios)
   - `padding: 1rem` (espaciado interno)

3. **Iconos deportivos**:
   - `width: 24px, height: 24px` (tamaño exacto)
   - `32px, 48px` para iconos más grandes

## 📚 **Ejemplos Prácticos**

### ✅ **Correcto - Usando REM para espaciado**

```scss
.workout-card {
  padding: 1.5rem; // Escalable con preferencias de usuario
  margin-bottom: 2rem; // Consistente con tipografía
  gap: 1rem; // Espaciado entre elementos
}

.exercise-title {
  font-size: 1.25rem; // Escalable
  margin-bottom: 0.5rem; // Proporcional al texto
}
```

### ✅ **Correcto - Usando PX para elementos precisos**

```scss
.workout-card {
  border: 1px solid #e0e0e0; // Línea siempre nítida
  border-radius: 12px; // Diseño específico
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); // Efecto preciso
}

.difficulty-icon {
  width: 24px; // Tamaño exacto del icono
  height: 24px;
}
```

### ❌ **Incorrecto - Mezclando mal las unidades**

```scss
.workout-card {
  padding: 24px; // ❌ Debería ser 1.5rem
  border-radius: 0.75rem; // ❌ Debería ser 12px
  font-size: 18px; // ❌ Debería ser 1.125rem
  border: 0.0625rem solid; // ❌ Debería ser 1px
}
```

## 🔍 **Testing y Verificación**

### 🧪 **Pruebas de Accesibilidad**

1. **Cambiar zoom del navegador** a 125%, 150%, 200%
2. **Cambiar configuración de fuente** en el sistema operativo
3. **Verificar que los espaciados se mantienen proporcionales**
4. **Comprobar que los bordes siguen siendo nítidos**

### 📱 **Pruebas Responsive**

1. **Móvil (320px-768px)**: Verificar que REM se adapta
2. **Tablet (768px-1024px)**: Espaciados proporcionales
3. **Desktop (1024px+)**: Mantener precisión visual

### 🎯 **Herramientas de Verificación**

```scss
// Debug: mostrar valores REM calculados
:root {
  --debug-rem-8: 0.5rem; /* = 8px si root=16px */
  --debug-rem-16: 1rem; /* = 16px si root=16px */
  --debug-rem-24: 1.5rem; /* = 24px si root=16px */
}
```

## 🚀 **Mejores Prácticas Finales**

1. **Espaciado de componentes**: Siempre REM
2. **Tipografía**: Siempre REM
3. **Bordes y líneas**: Siempre PX
4. **Iconos pequeños**: Siempre PX
5. **Sombras y efectos**: Siempre PX
6. **Consistency**: Usar el sistema definido
7. **Testing**: Verificar en diferentes tamaños de fuente

---

**💡 Recordatorio**: El objetivo es crear una interfaz que sea accesible, escalable y visualmente consistente para todos los usuarios de Box Training.
