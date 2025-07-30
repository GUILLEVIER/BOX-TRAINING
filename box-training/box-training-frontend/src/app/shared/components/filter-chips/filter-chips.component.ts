import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface FilterChip {
  key: string;
  label: string;
  value: any;
  removable?: boolean;
}

// SE ESTÁ USANDO
@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss'
})
export class FilterChipsComponent {
  @Input() chips: FilterChip[] = [];
  @Input() showClearAll: boolean = true;
  @Output() chipRemoved = new EventEmitter<FilterChip>();
  @Output() allCleared = new EventEmitter<void>();
  
  onChipRemoved(chip: FilterChip): void {
    this.chipRemoved.emit(chip);
  }
  
  clearAll(): void {
    this.allCleared.emit();
  }
  
  trackByChip(index: number, chip: FilterChip): string {
    return chip.key + chip.value;
  }
}
