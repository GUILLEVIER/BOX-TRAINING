import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// SE ESTÁ USANDO
@Component({
  selector: 'app-no-plan-message',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './no-plan-message.component.html',
  styleUrls: ['./no-plan-message.component.scss']
})
export class NoPlanMessageComponent {
  @Output() contactAdmin = new EventEmitter<void>();

  onContactAdmin(): void {
    this.contactAdmin.emit();
  }
}