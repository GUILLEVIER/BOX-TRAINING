import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

// NO SE ESTÁ USANDO
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="page-header">
      <div class="title-section">
        <button 
          *ngIf="showBackButton" 
          mat-icon-button 
          (click)="onBackClick()" 
          [matTooltip]="backTooltip" 
          class="back-button">
          <mat-icon>{{ backIcon }}</mat-icon>
        </button>
        <h1>
          <mat-icon *ngIf="titleIcon">{{ titleIcon }}</mat-icon>
          {{ title }}
        </h1>
        <p *ngIf="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-actions" *ngIf="actions">
        <ng-container [ngTemplateOutlet]="actions"></ng-container>
      </div>
    </div>
  `,
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() titleIcon?: string;
  @Input() showBackButton: boolean = false;
  @Input() backIcon: string = 'arrow_back';
  @Input() backTooltip: string = 'Volver';
  @Input() actions?: TemplateRef<any>;
  
  onBackClick(): void {
    window.history.back();
  }
}
