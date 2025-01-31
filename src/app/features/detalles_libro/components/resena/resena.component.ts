import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { ResenyaService } from '../../services/resenya.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-resena',
  imports: [
    NgForOf,
    MatIcon,
    NgIf
  ],
  templateUrl: './resena.component.html',
  standalone: true,
  styleUrl: './resena.component.css'
})
export class ResenaComponent {
  @Input() nombre: string = '';
  @Input() apellido: string = '';
  @Input() date: string = '';
  @Input() rating: number = 5;
  @Input() comment: string = '';
  @Input() id: number = 0;
  @Output() resenyaDeleted: EventEmitter<void> = new EventEmitter<void>();


  constructor(private resenyaService: ResenyaService) {}

  deleteResenya(): void {
    this.resenyaService.deleteResenya(this.id).subscribe(
      response => {
        console.log('Reseña eliminada con éxito', response);
        this.resenyaDeleted.emit();
      },
      error => {
        console.error('Error al eliminar la reseña', error);
      }
    );
  }

}
