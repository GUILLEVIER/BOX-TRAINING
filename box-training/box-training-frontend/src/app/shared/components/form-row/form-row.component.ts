import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// SE ESTÁ USANDO
@Component({
  selector: 'app-form-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-row" [class.full-width]="fullWidth">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './form-row.component.scss'
})
export class FormRowComponent {
  @Input() fullWidth: boolean = false;
}
