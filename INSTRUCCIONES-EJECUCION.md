# 🚀 Instrucciones para Ejecutar Box Training App

## ✅ Métodos para Iniciar la Aplicación

### **Método 1: Terminal Integrado de VS Code**

1. **Abrir terminal:**
   - Presiona `Ctrl+`` (backtick) o `Terminal > New Terminal`

2. **Ejecutar comandos:**
   ```bash
   cd box-training/box-training-frontend
   ng serve --host 0.0.0.0 --port 4200 --disable-host-check
   ```

3. **Acceder a:**
   - `http://localhost:4200`

### **Método 3: Script de Inicio**

1. **En el terminal:**
   ```bash
   cd box-training/box-training-frontend
   ./start-server.sh
   ```

## 🔐 Credenciales de Acceso

### 👨‍💼 **Administrador**
- **Email:** `admin@boxtraining.com`
- **Contraseña:** `admin123`
- **Funciones:** Gestión completa del gimnasio

### 👤 **Alumno**
- **Email:** `alumno@example.com`
- **Contraseña:** `alumno123`
- **Funciones:** Ver planes y gestionar reservas

## 🎯 Funcionalidades Disponibles

### **Para Administradores:**
- ✅ Dashboard con métricas del gimnasio
- ✅ CRUD completo de planes de entrenamiento
- ✅ Gestión de alumnos y suscripciones
- ✅ Cambio de estados de planes (Activo/Inactivo)
- ✅ Visualización de estadísticas básicas

### **Para Alumnos:**
- ✅ Dashboard personal con información del plan actual
- ✅ Visualización de clases disponibles
- ✅ Información del plan de suscripción
- ✅ Estado de la cuenta

### **Si hay errores de compilación:**

1. **Limpiar caché:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Build clean:**
   ```bash
   ng build --configuration=development
   ```

## 📱 Responsive Design

La aplicación funciona en:
- 📱 **Móviles** (320px+)
- 📲 **Tablets** (768px+)  
- 💻 **Desktop** (1024px+)

## 🌐 URLs Importantes

- **Aplicación principal:** `http://localhost:4200`
- **Login:** `http://localhost:4200/auth/login`
- **Admin Dashboard:** `http://localhost:4200/admin/dashboard`
- **Alumno Dashboard:** `http://localhost:4200/alumno/dashboard`

## 🎨 Características Técnicas

- **Framework:** Angular 17
- **UI Library:** Angular Material
- **Estado:** RxJS + BehaviorSubjects
- **Persistencia:** localStorage (Mock data)
- **Arquitectura:** Clean Architecture
- **Responsive:** Flexbox + CSS Grid

## ⚡ Quick Start

```bash
# 1. Navegar al proyecto
cd /workspaces/BOX-TRAINING/box-training/box-training-frontend

# 2. Verificar instalación
npm list

# 3. Iniciar servidor
ng serve --host 0.0.0.0 --port 4200 --disable-host-check

# 4. Abrir navegador
# http://localhost:4200
```

---

**¡La aplicación Box Training está lista para usar!** 🎉

**Desarrollada con ❤️ usando Angular 17 + Material Design**
