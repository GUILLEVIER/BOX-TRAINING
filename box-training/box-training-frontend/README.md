# 🥊 Box Training - Sistema de Gestión PWA

Sistema de gestión para gimnasio de boxeo desarrollado con Angular 17 como Progressive Web App (PWA).

## 📱 Características PWA

### 🌟 **Nueva Funcionalidad Progressive Web App**

Box Training ahora es una **Progressive Web App** completa que ofrece una experiencia similar a una aplicación nativa:

- **📱 Instalable**: Se puede instalar en dispositivos móviles y escritorio
- **⚡ Offline-First**: Funciona sin conexión a internet
- **🔄 Auto-actualizable**: Se actualiza automáticamente cuando hay nuevas versiones
- **📶 Detección de conectividad**: Notifica cambios en el estado de conexión
- **🚀 Performance optimizada**: Cache inteligente para carga ultrarrápida

### 📋 **Funcionalidades Implementadas**

#### 🔧 **Service Worker**

- Cache automático de recursos críticos
- Estrategias diferenciadas de cache por tipo de contenido
- Actualizaciones en segundo plano
- Soporte offline completo

#### 📱 **Instalación**

- Banner de instalación automático
- Prompt personalizado para iOS y Android
- Detección de PWA ya instalada
- Métricas de instalación

#### 🌐 **Modo Offline**

- Funcionamiento completo sin conexión
- Sincronización automática al restaurar conexión
- Notificaciones de estado de red
- Cache de datos críticos

#### 🎨 **Experiencia Nativa**

- Pantalla de splash personalizada
- Colores de tema coherentes (Cyan y Orange)
- Iconos optimizados para todas las plataformas
- Modo standalone (sin barras del navegador)

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- Angular CLI 17
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd box-training-frontend

# Instalar dependencias
npm install

# Instalar Angular PWA (ya incluido)
ng add @angular/pwa
```

### Scripts Disponibles

```bash
# Desarrollo
npm run start          # Servidor de desarrollo
npm run start:dev       # Servidor con auto-apertura

# Construcción
npm run build          # Build de desarrollo
npm run build:prod     # Build de producción con PWA

# Testing
npm run test           # Tests unitarios
npm run test:watch     # Tests en modo watch

# Utilidades
npm run lint           # Linting del código
npm run analyze        # Análisis del bundle
npm run clean          # Limpieza de cache
```

## 📱 Uso de PWA

### 🔧 **Para Desarrollo**

La PWA solo funciona en **producción** con **HTTPS**:

```bash
# 1. Compilar para producción
npm run build:prod

# 2. Servir con HTTPS
cd dist/box-training-frontend
npx http-server . -p 8080 --ssl

# 3. Abrir https://localhost:8080
```

### 📲 **Instalación en Dispositivos**

#### **Chrome/Edge (Desktop)**

1. Buscar ícono de instalación en la barra de direcciones
2. Click en "Instalar Box Training"
3. La app se agregará al menú de inicio

#### **iOS Safari**

1. Abrir en Safari
2. Tocar el botón "Compartir"
3. Seleccionar "Agregar a pantalla de inicio"

#### **Android Chrome**

1. Aparecerá banner de instalación automáticamente
2. Tocar "Instalar"
3. La app se agregará al launcher

### 🔍 **Verificación PWA**

#### **Chrome DevTools**

1. F12 → Application → Manifest
2. Verificar configuración del manifest
3. Application → Service Workers
4. Confirmar registro del SW

#### **Lighthouse Audit**

1. F12 → Lighthouse
2. Seleccionar "Progressive Web App"
3. Ejecutar audit para verificar compliance

## 🏗️ Arquitectura PWA

### 📁 **Estructura de Archivos PWA**

```
src/
├── manifest.webmanifest           # Configuración PWA
├── ngsw-config.json              # Configuración Service Worker
├── assets/icons/                 # Iconos PWA (72x72 a 512x512)
├── app/
│   ├── core/services/
│   │   └── pwa.service.ts        # Servicio PWA principal
│   └── shared/components/
│       └── pwa-install-banner/   # Banner de instalación
└── styles.scss                  # Estilos PWA
```

### ⚙️ **Configuración del Service Worker**

```json
{
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch", // Cache inmediato
      "resources": ["/*.css", "/*.js"]
    },
    {
      "name": "assets",
      "installMode": "lazy", // Cache bajo demanda
      "resources": ["/assets/**"]
    }
  ],
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "freshness", // Datos frescos
        "maxAge": "1h"
      }
    }
  ]
}
```

### 🎯 **Estrategias de Cache**

| Tipo            | Estrategia      | Descripción                                     |
| --------------- | --------------- | ----------------------------------------------- |
| **App Shell**   | Prefetch        | Cache inmediato de archivos críticos            |
| **Assets**      | Lazy + Prefetch | Cache bajo demanda, actualización en background |
| **API Data**    | Freshness       | Prioriza datos frescos, fallback a cache        |
| **Static Data** | Performance     | Prioriza cache, actualización periódica         |

## 🔧 Servicios PWA

### 📱 **PwaService**

Servicio principal para gestión de funcionalidades PWA:

```typescript
// Verificar si es PWA
this.pwaService.isPwa()

// Mostrar prompt de instalación
await this.pwaService.showInstallPrompt()

// Verificar actualizaciones
this.pwaService.checkForUpdate()

// Obtener estado de conexión
this.pwaService.getConnectionStatus()

// Escuchar cambios de conectividad
this.pwaService.onConnectionChange().subscribe(status => {
  console.log('Connection status:', status)
})
```

### 🎨 **PwaInstallBannerComponent**

Componente que muestra automáticamente el banner de instalación:

- Aparece después de 3 segundos
- Solo se muestra si la PWA no está instalada
- Permite descartar permanentemente
- Responsive para móvil y desktop

## 🎨 Personalización

### 🌈 **Colores del Tema**

```scss
:root {
  --box-training-primary: #00bcd4; // Cyan
  --box-training-accent: #ff9800; // Orange
  --box-training-warn: #f44336; // Red
  --box-training-background: #f5f5f5; // Light Gray
}
```

### 📱 **Iconos PWA**

Los iconos están en `src/assets/icons/` en los siguientes tamaños:

- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

Para reemplazar iconos:

1. Generar iconos en los tamaños requeridos
2. Mantener formato PNG
3. Usar diseño "maskable" (con padding)

### 🎯 **Manifest Personalizado**

```json
{
  "name": "Box Training - Sistema de Gestión",
  "short_name": "BoxTraining",
  "theme_color": "#00bcd4",
  "background_color": "#f5f5f5",
  "display": "standalone",
  "categories": ["health", "fitness", "sports"],
  "lang": "es"
}
```

## 📊 Performance y Optimización

### ⚡ **Métricas PWA**

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cache Hit Ratio**: > 90%

### 🔧 **Optimizaciones Implementadas**

1. **Lazy Loading**: Módulos cargados bajo demanda
2. **Code Splitting**: Bundle dividido por rutas
3. **Tree Shaking**: Eliminación de código no usado
4. **Service Worker**: Cache inteligente
5. **Preconnect**: Optimización de fuentes Google
6. **Bundle Analysis**: Análisis de tamaño

### 📈 **Monitoreo**

```bash
# Análisis del bundle
npm run analyze

# Verificar tamaño de cache
console.log(await pwaService.getCacheSize());

# Limpiar cache
await pwaService.clearCache();
```

## 🔒 Seguridad

### 🛡️ **Requisitos de Seguridad PWA**

- ✅ **HTTPS obligatorio** en producción
- ✅ **Content Security Policy** configurado
- ✅ **Service Worker** registrado desde mismo origen
- ✅ **Manifest** servido con tipo MIME correcto

### 🔐 **Configuración HTTPS**

Para desarrollo local con HTTPS:

```bash
# Opción 1: http-server con SSL
npx http-server dist/box-training-frontend -p 8080 --ssl

# Opción 2: serve con SSL
npx serve -s dist/box-training-frontend --ssl-cert cert.pem --ssl-key key.pem

# Opción 3: VS Code Live Server (configurar SSL en settings)
```

## 🚀 Deployment

### 🌐 **Hosting Recomendado**

PWA requiere HTTPS y configuración específica:

#### **Netlify**

```bash
# netlify.toml
[build]
  publish = "dist/box-training-frontend"

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```

#### **Vercel**

```json
// vercel.json
{
  "routes": [
    { "src": "/manifest.webmanifest", "headers": { "Content-Type": "application/manifest+json" } }
  ]
}
```

#### **Firebase Hosting**

```json
// firebase.json
{
  "hosting": {
    "public": "dist/box-training-frontend",
    "headers": [
      {
        "source": "/manifest.webmanifest",
        "headers": [{ "key": "Content-Type", "value": "application/manifest+json" }]
      }
    ]
  }
}
```

### 📋 **Checklist de Deployment**

- [ ] Compilar con `npm run build:prod`
- [ ] Verificar que `ngsw-worker.js` existe en dist/
- [ ] Confirmar que `manifest.webmanifest` está accesible
- [ ] Probar instalación en Chrome/Edge
- [ ] Validar con Lighthouse PWA audit
- [ ] Verificar funcionamiento offline

## 🐛 Troubleshooting

### ❓ **Problemas Comunes**

#### **Service Worker no se registra**

```bash
# Verificar en DevTools → Application → Service Workers
# Asegurarse de estar en HTTPS
# Revisar consola por errores
```

#### **PWA no es instalable**

- Verificar manifest.webmanifest accesible
- Confirmar iconos válidos (192x192 y 512x512 mínimo)
- Asegurar HTTPS activo
- Verificar Service Worker registrado

#### **Cache no funciona offline**

- Verificar ngsw-config.json
- Confirmar rutas en dataGroups
- Revisar estrategias de cache
- Limpiar cache del navegador

#### **Actualizaciones no aparecen**

```typescript
// Forzar verificación de actualizaciones
this.pwaService.checkForUpdate()

// Limpiar cache manualmente
await this.pwaService.clearCache()
window.location.reload()
```

### 🔧 **Debug Mode**

```typescript
// Habilitar logs del Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('SW Message:', event.data)
  })
}
```

## 📚 Recursos Adicionales

### 🔗 **Enlaces Útiles**

- [Angular PWA Documentation](https://angular.io/guide/service-worker-intro)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)

### 📖 **Guías Recomendadas**

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker Cookbook](https://serviceworke.rs/)
- [Angular Universal SSR](https://angular.io/guide/universal)

---

## 👥 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear branch para feature/bugfix
3. Probar PWA en al menos 2 navegadores
4. Verificar Lighthouse audit > 90%
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

**¡Disfruta de tu nueva PWA Box Training! 🥊💪**
