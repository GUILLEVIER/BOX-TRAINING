import { CommonModule, isPlatformBrowser } from '@angular/common'
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subject, takeUntil } from 'rxjs'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { PwaService } from '../../../core/services/pwa.service'

/**
 * Componente para mostrar banner de instalación PWA
 */
@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './pwa-install-banner.component.html',
  styleUrls: ['./pwa-install-banner.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class PwaInstallBannerComponent implements OnInit, OnDestroy {
  showBanner = false
  isOffline = false
  updateAvailable = false

  private readonly destroy$ = new Subject<void>()
  private isBrowser: boolean

  constructor(
    private pwaService: PwaService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkInstallBanner()
      this.setupConnectionListener()
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Verifica si debe mostrar el banner de instalación
   */
  private checkInstallBanner(): void {
    // No mostrar si ya es PWA o si ya se descartó
    if (this.pwaService.isPwa() || this.wasBannerDismissed()) {
      return
    }

    // Mostrar después de un delay
    setTimeout(() => {
      if (this.pwaService.canInstall()) {
        this.showBanner = true
      }
    }, 3000)
  }

  /**
   * Configura el listener para cambios de conexión
   */
  private setupConnectionListener(): void {
    // Estado inicial
    this.isOffline = this.pwaService.isOffline()

    // Escuchar cambios
    this.pwaService
      .onConnectionChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isOffline = status === 'offline'

        if (status === 'online') {
          this.snackBar.open('Conexión restaurada', '', {
            duration: 2000,
            panelClass: ['success-snackbar'],
          })
        }
      })
  }

  /**
   * Instala la aplicación
   */
  async installApp(): Promise<void> {
    try {
      const installed = await this.pwaService.showInstallPrompt()

      if (installed) {
        this.showBanner = false
        this.snackBar.open('¡App instalada exitosamente!', '', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        })
      }
    } catch (error) {
      this.snackBar.open('Error al instalar la aplicación', '', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      })
    }
  }

  /**
   * Descarta el banner de instalación
   */
  dismissBanner(): void {
    this.showBanner = false
    this.saveBannerDismissed()
  }

  /**
   * Actualiza la aplicación
   */
  updateApp(): void {
    this.pwaService.updateApp()
  }

  /**
   * Verifica si el banner fue descartado previamente
   */
  private wasBannerDismissed(): boolean {
    if (!this.isBrowser) return false
    return localStorage.getItem('pwa-banner-dismissed') === 'true'
  }

  /**
   * Guarda que el banner fue descartado
   */
  private saveBannerDismissed(): void {
    if (this.isBrowser) {
      localStorage.setItem('pwa-banner-dismissed', 'true')
    }
  }
}
