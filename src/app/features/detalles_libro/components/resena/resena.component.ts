import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DetallesLibroService } from '../../services/detalles-libro.service';
import {AlertConfirmarComponent} from '../../../../shared/components/alert-confirmar/alert-confirmar.component';

@Component({
  selector: 'app-resena',
  imports: [
    NgForOf,
    MatIcon,
    NgIf,
    AlertConfirmarComponent
  ],
  templateUrl: './resena.component.html',
  standalone: true,
  styleUrls: ['./resena.component.css']
})
export class ResenaComponent {
  @Input() nombre: string = '';
  @Input() apellido: string = '';
  @Input() date: string = '';
  @Input() rating: number = 5;
  @Input() comment: string = '';
  @Input() id: number = 0;
  @Input() idClienteResena!: number; // ID del cliente que publicó la reseña
  @Input() idClienteActual!: number;
  @Output() resenyaDeleted: EventEmitter<number> = new EventEmitter<number>();

  // Variable para mostrar la alerta de confirmación
  showConfirmDelete: boolean = false;

  constructor(private detallesLibroService: DetallesLibroService) {}

  // Función para eliminar la reseña
  deleteResenya(): void {
    console.log('ID de la reseña:', this.id);
    if (this.id !== undefined && this.id !== null) {
      this.detallesLibroService.deleteResenya(this.id).subscribe(
        response => {
          console.log('Reseña eliminada con éxito', response);
          this.resenyaDeleted.emit(this.id); // Emitir el ID después de la eliminación
          this.showConfirmDelete = false; // Cerrar la alerta
        },
        error => {
          console.error('Error al eliminar la reseña', error);
        }
      );
    } else {
      console.error('ID de reseña no válido');
    }
  }

  cancelDelete(): void {
    this.showConfirmDelete = false; // Cerrar la alerta
  }
}
