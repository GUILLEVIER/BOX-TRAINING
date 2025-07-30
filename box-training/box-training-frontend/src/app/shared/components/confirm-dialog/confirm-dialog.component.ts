import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

/**
 * Datos para el diálogo de confirmación
 */
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

/**
 * Componente de diálogo de confirmación reutilizable
 * Permite confirmar acciones importantes con el usuario
 */
// SE ESTÁ USANDO
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  /**
   * Obtiene el icono según el tipo de diálogo
   */
  get icon(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      case 'info':
      default:
        return 'help';
    }
  }

  /**
   * Obtiene el color del icono según el tipo
   */
  get iconColor(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warn';
      case 'danger':
        return 'warn';
      case 'info':
      default:
        return 'primary';
    }
  }

  /**
   * Obtiene el color del botón según el tipo
   */
  get buttonColor(): string {
    switch (this.data.type) {
      case 'warning':
      case 'danger':
        return 'warn';
      case 'info':
      default:
        return 'primary';
    }
  }

  /**
   * Maneja la cancelación del diálogo
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Maneja la confirmación del diálogo
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
