import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { MatListModule } from '@angular/material/list'

import { ScheduleBlock } from '../schedules-create.component'
import { MockDataService } from '../../../../core/services/mock-data.service'

/**
 * Información del instructor
 */
interface InstructorInfo {
  id: string
  firstName: string
  lastName: string
  specialization: string
  experience: string
}

/**
 * Información de estudiante reservado
 */
interface ReservedStudent {
  id: string
  firstName: string
  lastName: string
}

/**
 * Diálogo para mostrar los detalles de un bloque de horario
 */
@Component({
  selector: 'app-schedule-detail-dialog',
  standalone: true,
  styleUrl: './schedule-detail-dialog.component.scss',
  template: `
    <div class="schedule-detail-dialog">
      <h2 mat-dialog-title>
        <mat-icon>schedule</mat-icon>
        Detalle del Horario
      </h2>

      <mat-dialog-content>
        <!-- Información básica del horario -->
        <div class="schedule-basic-info">
          <h3>Información de la Clase</h3>
          <div class="info-grid">
            <div class="info-item">
              <mat-icon>fitness_center</mat-icon>
              <div>
                <strong>Tipo de Clase:</strong>
                <span>{{ data.classType }}</span>
              </div>
            </div>

            <div class="info-item">
              <mat-icon>access_time</mat-icon>
              <div>
                <strong>Horario:</strong>
                <span>{{ data.startTime }} - {{ data.endTime }}</span>
              </div>
            </div>

            <div class="info-item">
              <mat-icon>room</mat-icon>
              <div>
                <strong>Sala:</strong>
                <span>{{ data.room }}</span>
              </div>
            </div>

            <div class="info-item">
              <mat-icon>group</mat-icon>
              <div>
                <strong>Capacidad:</strong>
                <span>{{ data.currentReservations || 0 }}/{{ data.maxCapacity }} personas</span>
              </div>
            </div>
          </div>

          @if (data.description) {
          <div class="description">
            <h4>Descripción:</h4>
            <p>{{ data.description }}</p>
          </div>
          }
        </div>

        <mat-divider></mat-divider>

        <!-- Información del instructor -->
        <div class="instructor-info">
          <h3>Instructor</h3>
          @if (instructorInfo(); as instructor) {
          <div class="instructor-card">
            <mat-icon>person</mat-icon>
            <div class="instructor-details">
              <h4>{{ instructor.firstName }} {{ instructor.lastName }}</h4>
              <p><strong>Especialización:</strong> {{ instructor.specialization }}</p>
              <p><strong>Experiencia:</strong> {{ instructor.experience }}</p>
            </div>
          </div>
          } @else {
          <p>Cargando información del instructor...</p>
          }
        </div>

        <mat-divider></mat-divider>

        <!-- Estudiantes reservados -->
        <div class="reserved-students">
          <h3>Estudiantes Reservados ({{ reservedStudents().length }})</h3>
          @if (reservedStudents().length > 0) {
          <mat-list>
            @for (student of reservedStudents(); track student.id) {
            <mat-list-item>
              <mat-icon matListItemIcon>person</mat-icon>
              <div matListItemTitle>{{ student.firstName }} {{ student.lastName }}</div>
            </mat-list-item>
            }
          </mat-list>
          } @else {
          <p>No hay estudiantes reservados aún.</p>
          }
        </div>

        <!-- Estado de disponibilidad -->
        <div class="availability-status">
          @if (data.available) {
          <div class="status available">
            <mat-icon>check_circle</mat-icon>
            <span>Disponible para reserva</span>
          </div>
          } @else {
          <div class="status full">
            <mat-icon>warning</mat-icon>
            <span>Capacidad máxima alcanzada</span>
          </div>
          }
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cerrar</button>
        @if (data.available) {
        <button mat-raised-button color="primary" (click)="onReserve()">
          <mat-icon>book_online</mat-icon>
          Reservar Horario
        </button>
        }
      </mat-dialog-actions>
    </div>
  `,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDetailDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ScheduleDetailDialogComponent>)
  private readonly mockDataService = inject(MockDataService)

  /** Datos del horario */
  readonly data: ScheduleBlock = inject(MAT_DIALOG_DATA)

  // Signals para los datos adicionales
  protected readonly instructorInfo = signal<InstructorInfo | null>(null)
  protected readonly reservedStudents = signal<ReservedStudent[]>([])

  constructor() {
    this.loadAdditionalData()
  }

  /**
   * Carga información adicional del horario
   */
  private loadAdditionalData(): void {
    // Cargar información del instructor desde MockDataService
    setTimeout(() => {
      const instructor = this.mockDataService.getInstructorById(this.data.instructorId)
      if (instructor) {
        this.instructorInfo.set({
          id: instructor.id,
          firstName: instructor.name,
          lastName: instructor.lastName,
          specialization: instructor.specialties.join(', '),
          experience: instructor.biography || 'Instructor experimentado',
        })
      } else {
        // Fallback si no se encuentra el instructor
        this.instructorInfo.set({
          id: this.data.instructorId,
          firstName: 'Instructor',
          lastName: 'No encontrado',
          specialization: 'N/A',
          experience: 'N/A',
        })
      }
    }, 500)

    // Cargar estudiantes reservados desde MockDataService
    setTimeout(() => {
      const reservations = this.mockDataService.getReservations()
      const scheduleReservations = reservations.filter(
        r => r.scheduleId === this.data.id && r.status === 'SCHEDULED'
      )

      const students: ReservedStudent[] = []
      scheduleReservations.forEach(reservation => {
        const student = this.mockDataService.getStudentById(reservation.studentId)
        if (student) {
          students.push({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
          })
        }
      })

      this.reservedStudents.set(students)
    }, 700)
  }

  /**
   * Cierra el diálogo sin acción
   */
  protected onCancel(): void {
    this.dialogRef.close()
  }

  /**
   * Confirma la reserva y cierra el diálogo
   */
  protected onReserve(): void {
    this.dialogRef.close('reserve')
  }
}
