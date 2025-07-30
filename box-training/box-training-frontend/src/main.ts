import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * Bootstrap de la aplicación usando arquitectura standalone de Angular 17
 * Configuración principal de proveedores y servicios
 */
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('Error al inicializar la aplicación:', err));
