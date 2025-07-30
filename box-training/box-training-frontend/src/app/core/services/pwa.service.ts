import { Injectable, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map, Subject, takeUntil, Observable } from 'rxjs';

/**
 * Servicio PWA para manejar actualizaciones y funcionalidades offline
 */
@Injectable({
  providedIn: 'root'
})
export class PwaService implements OnDestroy {
  
  private readonly destroy$ = new Subject<void>();
  private promptEvent: any;
  private isBrowser: boolean;

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.initializePromptInstall();
      this.initializeSwUpdate();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el prompt de instalación
   */
  private initializePromptInstall(): void {
    if (!this.isBrowser) return;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir que el navegador muestre automáticamente el prompt
      e.preventDefault();
      // Guardar el evento para usarlo después
      this.promptEvent = e;
    });
  }

  /**
   * Inicializa las actualizaciones del Service Worker
   */
  private initializeSwUpdate(): void {
    if (!this.isBrowser || !this.swUpdate.isEnabled) {
      return;
    }

    // Escuchar cuando hay una nueva versión disponible
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.showUpdateNotification();
      });

    // Verificar actualizaciones cada 6 horas
    if (this.isBrowser) {
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);
    }
  }

  /**
   * Muestra notificación de actualización disponible
   */
  private showUpdateNotification(): void {
    const snackBarRef = this.snackBar.open(
      'Nueva versión disponible',
      'Actualizar',
      {
        duration: 0, // No cierra automáticamente
        panelClass: ['update-snackbar']
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.updateApp();
    });
  }

  /**
   * Actualiza la aplicación
   */
  public updateApp(): void {
    if (!this.isBrowser || !this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.activateUpdate().then(() => {
      if (this.isBrowser) {
        window.location.reload();
      }
    });
  }

  /**
   * Verifica si hay actualizaciones disponibles
   */
  public checkForUpdate(): void {
    if (this.isBrowser && this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }

  /**
   * Verifica si la app está siendo ejecutada como PWA
   */
  public isPwa(): boolean {
    if (!this.isBrowser) return false;
    
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }

  /**
   * Verifica si el prompt de instalación está disponible
   */
  public canInstall(): boolean {
    return !!this.promptEvent;
  }

  /**
   * Muestra el prompt de instalación
   */
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.isBrowser || !this.promptEvent) {
      return false;
    }

    try {
      // Mostrar el prompt
      this.promptEvent.prompt();
      
      // Esperar la respuesta del usuario
      const result = await this.promptEvent.userChoice;
      
      // Limpiar el evento
      this.promptEvent = null;
      
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('Error al mostrar prompt de instalación:', error);
      return false;
    }
  }

  /**
   * Obtiene información sobre el estado offline/online
   */
  public getConnectionStatus(): 'online' | 'offline' {
    if (!this.isBrowser) return 'online';
    return navigator.onLine ? 'online' : 'offline';
  }

  /**
   * Escucha cambios en el estado de conexión
   */
  public onConnectionChange(): Observable<'online' | 'offline'> {
    const connection$ = new Subject<'online' | 'offline'>();

    if (this.isBrowser) {
      window.addEventListener('online', () => {
        connection$.next('online');
      });

      window.addEventListener('offline', () => {
        connection$.next('offline');
      });
    }

    return connection$.asObservable().pipe(takeUntil(this.destroy$));
  }

  /**
   * Verifica si la aplicación está en modo offline
   */
  public isOffline(): boolean {
    if (!this.isBrowser) return false;
    return !navigator.onLine;
  }

  /**
   * Obtiene el tamaño del cache
   */
  public async getCacheSize(): Promise<number> {
    if (!this.isBrowser) return 0;
    
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  /**
   * Limpia el cache de la aplicación
   */
  public async clearCache(): Promise<void> {
    if (!this.isBrowser) return;
    
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }

  /**
   * Registra un evento de uso offline para analytics
   */
  public trackOfflineUsage(action: string): void {
    // Aquí puedes integrar con tu sistema de analytics
    console.log(`Uso offline registrado: ${action}`);
  }
}
