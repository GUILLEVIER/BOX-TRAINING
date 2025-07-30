import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Reservation } from '../../../core/models';

// SE ESTÁ USANDO
@Component({
  selector: 'app-upcoming-reservations',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule],
  templateUrl: './upcoming-reservations.component.html',
  styleUrls: [`./upcoming-reservations.component.scss`]
})
export class UpcomingReservationsComponent {
  @Input() reservations: Reservation[] = [];
  @Output() navigateToSchedules = new EventEmitter<void>();
  @Output() navigateToReservations = new EventEmitter<void>();
  @Output() cancelReservation = new EventEmitter<Reservation>();

  onNavigateToSchedules(): void {
    this.navigateToSchedules.emit();
  }

  onNavigateToReservations(): void {
    this.navigateToReservations.emit();
  }

  onCancelReservation(reservation: Reservation): void {
    this.cancelReservation.emit(reservation);
  }

  formatDateWithTime(date: Date): string {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getScheduleInfo(scheduleId: string): string {
    // Esta función debería obtener la información del horario
    // Por ahora retorna un placeholder
    return `Información del horario ${scheduleId}`;
  }

  trackReservation(index: number, reservation: Reservation): string {
    return reservation.id;
  }
}