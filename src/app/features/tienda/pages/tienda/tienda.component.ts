import { Component } from '@angular/core';
import {FiltroComponent} from '../../components/filtro/filtro.component';
import {CuadroProductoComponent} from "../../components/cuadro-producto/cuadro-producto.component";

@Component({
  selector: 'app-tienda',
    imports: [FiltroComponent, CuadroProductoComponent],
  templateUrl: './tienda.component.html',
  standalone: true,
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {

}
