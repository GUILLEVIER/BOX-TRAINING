import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MainHeaderComponent } from '../../../shared/components'

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, MainHeaderComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDashboardComponent implements OnInit {
  ngOnInit() {
    // Aquí puedes agregar la lógica necesaria para el componente de dashboard del instructor
    // Por ejemplo, cargar estadísticas o información relevante para el instructor
  }
}
