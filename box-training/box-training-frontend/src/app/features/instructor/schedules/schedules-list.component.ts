import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MainHeaderComponent } from '../../../shared/components'

@Component({
  selector: 'app-schedules-list',
  standalone: true,
  imports: [CommonModule, MainHeaderComponent],
  templateUrl: './schedules-list.component.html',
  styleUrls: ['./schedules-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesListComponent implements OnInit {
  ngOnInit() {
    // Aquí puedes agregar la lógica necesaria para el componente de lista de horarios
    // Por ejemplo, cargar los horarios desde un servicio y mostrarlos en una lista
  }
}
