import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonComponent } from '../boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-alert-confirmar',
  imports: [
    BotonComponent,
    MatIcon,
    NgClass,
    NgIf
  ],
  templateUrl: './alert-confirmar.component.html',
  standalone: true,
  styleUrls: ['./alert-confirmar.component.css']
})
export class AlertConfirmarComponent {
  @Input() message: string = '¿Estás seguro?';
  @Input() confirmLabel: string = 'Sí';
  @Input() showCancelButton: boolean = true;
  @Input() showIcon: boolean = true;
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();


  /**
  * Emitir evento de confirmación
   */
  onConfirm(): void {
    this.confirm.emit();
  }

  /**
  * Emitir evento de cancelación
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
