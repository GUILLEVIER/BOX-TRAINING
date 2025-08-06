import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { ApplicationConfig, isDevMode } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { authInterceptor } from './core/interceptors/auth.interceptor'
import { provideServiceWorker } from '@angular/service-worker'

/**
 * Configuración principal de la aplicación Angular
 * Define todos los proveedores necesarios para la aplicación
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Configurar enrutamiento
    provideRouter(routes),
    // Habilitar hidratación del cliente para SSR
    provideClientHydration(),
    // Habilitar animaciones de Angular Material
    provideAnimationsAsync(),
    // Configurar cliente HTTP con interceptores
    provideHttpClient(withInterceptors([authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }), provideAnimationsAsync(),
  ],
}
