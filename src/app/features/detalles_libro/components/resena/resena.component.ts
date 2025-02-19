import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DetallesLibroService } from '../../services/detalles-libro.service';
import {MatIcon} from '@angular/material/icon';
import {AlertConfirmarComponent} from '../../../../shared/components/alert-confirmar/alert-confirmar.component';
import {NgForOf, NgIf} from '@angular/common';
import {PerfilUsuarioService} from '../../../usuario/services/perfil-usuario.service';

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
  showDeleteButton: boolean = false;
  showDenunciaButton: boolean = false;
  rol: number = 0;

  ngOnInit() {
    this.rating = Number(this.rating);// Ensure rating is a number
    this.usuarioService.rolUsuario().subscribe(
      (response: any) => {
        this.rol = response.rol;
        console.log('Rol del usuario:', this.rol);
        if (this.idClienteResena === this.idClienteActual || this.rol === 1) {
          this.showDeleteButton = true;
        }
      },
      (error: any) => {
        console.error('Error al obtener el rol del usuario', error);
      }
    )
  }

  constructor(private detallesLibroService: DetallesLibroService, private usuarioService: PerfilUsuarioService) {}

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

  denunciaResenya(): void {
    if (this.id !== undefined && this.id !== null) {
      this.detallesLibroService.postDenuciarResenya(this.id).subscribe(
        (response: any) => {
          console.log('Reseña denunciada');
        },
        (error: any) => {
          console.error('Error al denunciar la reseña', error);
        }
      );
    } else {
      console.error('ID de reseña no válido');
    }
    this.showDenunciaButton = false;
  }

  protected readonly Array = Array;
}
