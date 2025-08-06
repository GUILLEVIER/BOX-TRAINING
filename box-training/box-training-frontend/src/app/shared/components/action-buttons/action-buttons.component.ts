import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ActionButton, MenuAction } from '../../../interfaces/propsInterface'

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.scss',
})
export class ActionButtonsComponent {
  @Input() actionButtons: ActionButton[] = []
  @Input() menuActions: MenuAction[] = []
  @Output() actionClicked = new EventEmitter<{ action: string; data?: any }>()

  onActionClick(action: string): void {
    this.actionClicked.emit({ action })
  }

  trackByAction(index: number, button: ActionButton): string {
    return button.action + button.icon
  }

  trackByMenuAction(index: number, action: MenuAction): string {
    return action.action + action.label
  }
}
