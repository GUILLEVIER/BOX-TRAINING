import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './core/services/pwa.service';
import { PwaInstallBannerComponent } from './shared/components/pwa-install-banner/pwa-install-banner.component';

/**
 * Componente raíz de la aplicación Box Training
 * Componente standalone que sirve como contenedor principal
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PwaInstallBannerComponent
  ],
  template: `
    <!-- Contenedor principal de la aplicación -->
    <div class="app-container">
      <!-- Router outlet para renderizar los componentes según la ruta -->
      <router-outlet></router-outlet>
      
      <!-- Banner PWA para instalación -->
      <app-pwa-install-banner></app-pwa-install-banner>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }
  `]
})

export class AppComponent implements OnInit {
  title = 'Box Training - Sistema de Gestión';

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {
    // Inicializar PWA
    this.initializePwa();
  }

  /**
   * Inicializa las funcionalidades PWA
   */
  private initializePwa(): void {
    // Verificar actualizaciones al iniciar
    this.pwaService.checkForUpdate();
    
    // Log del estado PWA
    console.log('PWA Status:', {
      isPwa: this.pwaService.isPwa(),
      canInstall: this.pwaService.canInstall(),
      isOffline: this.pwaService.isOffline()
    });
  }
}
