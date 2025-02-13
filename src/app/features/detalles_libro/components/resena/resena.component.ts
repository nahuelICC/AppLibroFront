import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DetallesLibroService } from '../../services/detalles-libro.service';
import {MatIcon} from '@angular/material/icon';
import {AlertConfirmarComponent} from '../../../../shared/components/alert-confirmar/alert-confirmar.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-resena',
  templateUrl: './resena.component.html',
  imports: [
    MatIcon,
    AlertConfirmarComponent,
    NgForOf,
    NgIf
  ],
  standalone: true,
  styleUrls: ['./resena.component.css']
})
export class ResenaComponent implements OnInit {
  @Input() nombre: string = '';
  @Input() apellido: string = '';
  @Input() date: string = '';
  @Input() rating: number = 5;
  @Input() comment: string = '';
  @Input() id: number = 0;
  @Input() idClienteResena!: number;
  @Input() idClienteActual!: number;
  @Output() resenyaDeleted: EventEmitter<number> = new EventEmitter<number>();

  showConfirmDelete: boolean = false;

  ngOnInit() {
    this.rating = Number(this.rating); // Ensure rating is a number
  }

  constructor(private detallesLibroService: DetallesLibroService) {}

  deleteResenya(): void {
    if (this.id !== undefined && this.id !== null) {
      this.detallesLibroService.deleteResenya(this.id).subscribe(
        (response: any) => {
          this.resenyaDeleted.emit(this.id);
          this.showConfirmDelete = false;
        },
        (error: any) => {
          console.error('Error al eliminar la reseña', error);
        }
      );
    } else {
      console.error('ID de reseña no válido');
    }
  }

  cancelDelete(): void {
    this.showConfirmDelete = false;
  }

  protected readonly Array = Array;
}
