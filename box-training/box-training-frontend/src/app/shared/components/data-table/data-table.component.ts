import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingComponent } from "../loading/loading.component";

export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  template?: TemplateRef<any>;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: { value: any; label: string; }[];
  placeholder?: string;
}

// UNUSED
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
    LoadingComponent
],
  template: `
    <div class="table-container">
      <!-- Header -->
      <div class="table-header" *ngIf="title || headerActions">
        <h1 *ngIf="title">
          <mat-icon *ngIf="titleIcon">{{ titleIcon }}</mat-icon>
          {{ title }}
        </h1>
        <div class="header-actions" *ngIf="headerActions">
          <ng-container [ngTemplateOutlet]="headerActions"></ng-container>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card" *ngIf="filters.length > 0">
        <mat-card-content>
          <div class="filters-row">
            <ng-container *ngFor="let filter of filters">
              <mat-form-field appearance="outline" *ngIf="filter.type === 'text'">
                <mat-label>{{ filter.label }}</mat-label>
                <input 
                  matInput 
                  [placeholder]="filter.placeholder || ''"
                  (keyup)="onFilterChange(filter.key, $event)">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline" *ngIf="filter.type === 'select'">
                <mat-label>{{ filter.label }}</mat-label>
                <mat-select (selectionChange)="onFilterChange(filter.key, $event)">
                  <mat-option value="">Todos</mat-option>
                  <mat-option 
                    *ngFor="let option of filter.options" 
                    [value]="option.value">
                    {{ option.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </ng-container>
            
            <button mat-button (click)="clearFilters()" *ngIf="filters.length > 0">
              <mat-icon>clear</mat-icon>
              Limpiar Filtros
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading -->
      <app-loading *ngIf="loading" [message]="loadingMessage"></app-loading>

      <!-- Table -->
      <mat-card class="table-card" *ngIf="!loading">
        <mat-card-content>
          <div class="table-wrapper">
            <table mat-table [dataSource]="dataSource" matSort [class]="tableClass">
              <!-- Dynamic columns -->
              <ng-container 
                *ngFor="let column of columns" 
                [matColumnDef]="column.key">
                <th mat-header-cell *matHeaderCellDef [mat-sort-header]="column.sortable ? column.key : ''">
                  {{ column.label }}
                </th>
                <td mat-cell *matCellDef="let row">
                  <ng-container *ngIf="column.template; else defaultCell">
                    <ng-container 
                      [ngTemplateOutlet]="column.template" 
                      [ngTemplateOutletContext]="{ $implicit: row, column: column }">
                    </ng-container>
                  </ng-container>
                  <ng-template #defaultCell>
                    {{ getNestedProperty(row, column.key) }}
                  </ng-template>
                </td>
              </ng-container>

              <!-- Actions column -->
              <ng-container matColumnDef="actions" *ngIf="actionsTemplate">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let row">
                  <ng-container 
                    [ngTemplateOutlet]="actionsTemplate" 
                    [ngTemplateOutletContext]="{ $implicit: row }">
                  </ng-container>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- No data message -->
            <div *ngIf="dataSource.data.length === 0" class="no-data">
              <mat-icon>{{ noDataIcon }}</mat-icon>
              <p>{{ noDataMessage }}</p>
              <ng-container *ngIf="noDataActions">
                <ng-container [ngTemplateOutlet]="noDataActions"></ng-container>
              </ng-container>
            </div>
          </div>

          <!-- Paginator -->
          <mat-paginator 
            [pageSizeOptions]="pageSizeOptions" 
            [showFirstLastButtons]="showFirstLastButtons">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() title?: string;
  @Input() titleIcon?: string;
  @Input() columns: TableColumn[] = [];
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() filters: FilterConfig[] = [];
  @Input() loading: boolean = false;
  @Input() loadingMessage: string = 'Cargando datos...';
  @Input() tableClass: string = '';
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() showFirstLastButtons: boolean = true;
  @Input() noDataMessage: string = 'No se encontraron datos';
  @Input() noDataIcon: string = 'info';
  
  @Input() headerActions?: TemplateRef<any>;
  @Input() actionsTemplate?: TemplateRef<any>;
  @Input() noDataActions?: TemplateRef<any>;
  
  @Output() filterChange = new EventEmitter<{key: string, value: any}>();
  @Output() filtersCleared = new EventEmitter<void>();
  
  get displayedColumns(): string[] {
    const cols = this.columns.map(col => col.key);
    if (this.actionsTemplate) {
      cols.push('actions');
    }
    return cols;
  }
  
  onFilterChange(key: string, event: any): void {
    const value = event.target?.value || event.value;
    this.filterChange.emit({ key, value });
  }
  
  clearFilters(): void {
    this.filtersCleared.emit();
  }
  
  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }
}
