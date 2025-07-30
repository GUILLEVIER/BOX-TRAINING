import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// PROBADO
@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {
  @Input() title: string = 'Dashboard';
  @Input() userName?: string;
  @Input() userRole?: string;
}