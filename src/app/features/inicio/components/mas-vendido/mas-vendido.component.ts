import {Component, OnInit} from '@angular/core';
import {CuadroProductoComponent} from '../../../tienda/components/cuadro-producto/cuadro-producto.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { Observable } from 'rxjs';
import { CuadroProducto } from '../../../tienda/DTOs/CuadroProducto';
import { LibroServiceService } from '../../../../core/services/libro/libro-service.service';
import {LibroInicio} from '../../DTOs/LibroInicio';
import {RouterLink} from '@angular/router';
import {NombreGeneroPipe} from '../../../tienda/pipes/nombre-genero.pipe';

/**
 * Componente que muestra los libros más vendidos
 */
@Component({
  selector: 'app-mas-vendido',
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    RouterLink,
    NombreGeneroPipe
  ],
  templateUrl: './mas-vendido.component.html',
  standalone: true,
  styleUrl: './mas-vendido.component.css'
})
export class MasVendidoComponent implements OnInit{
  masVendidos$!: Observable<LibroInicio[]>; // Usamos el modelo LibroInicio

  constructor(private libroService: LibroServiceService) {}

  ngOnInit(): void {
    this.masVendidos$ = this.libroService.getMasVendidos(); // Aquí ya obtenemos los datos con el modelo adecuado
  }

}
