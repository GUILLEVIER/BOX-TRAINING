import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource } from '@angular/material/table'
import { LoadingComponent } from '../loading/loading.component'
import { FilterConfig, TableColumn } from '../../../interfaces/propsInterface'

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LoadingComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  @Input() title?: string
  @Input() titleIcon?: string
  @Input() columns: TableColumn[] = []
  @Input() dataSource!: MatTableDataSource<any>
  @Input() filters: FilterConfig[] = []
  @Input() loading: boolean = false
  @Input() loadingMessage: string = 'Cargando datos...'
  @Input() tableClass: string = ''
  @Input() pageSizeOptions: number[] = [5, 10, 20]
  @Input() showFirstLastButtons: boolean = true
  @Input() noDataMessage: string = 'No se encontraron datos'
  @Input() noDataIcon: string = 'info'
  @Input() headerActions?: TemplateRef<any>
  @Input() actionsTemplate?: TemplateRef<any>
  @Input() noDataActions?: TemplateRef<any>
  @Output() filterChange = new EventEmitter<{ key: string; value: any }>()
  @Output() filtersCleared = new EventEmitter<void>()

  get displayedColumns(): string[] {
    const cols = this.columns.map(col => col.key)
    if (this.actionsTemplate) {
      cols.push('actions')
    }
    return cols
  }

  onFilterChange(key: string, event: any): void {
    const value = event.target?.value || event.value
    this.filterChange.emit({ key, value })
  }

  clearFilters(): void {
    this.filtersCleared.emit()
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj)
  }
}
