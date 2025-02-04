import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GeneroDTO} from '../../DTOs/GeneroDTO';
import {NgForOf} from '@angular/common';
import {NombreGeneroPipe} from '../../pipes/nombre-genero.pipe';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-categorias',
  imports: [
    NgForOf,
    NombreGeneroPipe,
    BotonComponent
  ],
  templateUrl: './categorias.component.html',
  standalone: true,
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {
  @Input() categories: GeneroDTO[] = []; // Recibe las categorías desde el padre
  @Output() categorySelected = new EventEmitter<number | null>();
  @Input() categoriaSeleccionada: number | null = null;


  onCategoria(numero: number): void {
    this.categorySelected.emit(numero === this.categoriaSeleccionada ? null : numero);
  }
}
