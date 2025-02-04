import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BotonComponent} from '../boton/boton.component';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-alert-confirmar',
  imports: [
    BotonComponent,
    MatIcon
  ],
  templateUrl: './alert-confirmar.component.html',
  standalone: true,
  styleUrl: './alert-confirmar.component.css'
})
export class AlertConfirmarComponent {
  @Input() message: string = '¿Estás seguro?';
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  // Emitir evento de confirmación
  onConfirm(): void {
    this.confirm.emit();
  }

  // Emitir evento de cancelación
  onCancel(): void {
    this.cancel.emit();
  }

}
