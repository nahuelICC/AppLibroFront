import { Component } from '@angular/core';
import {BotonComponent} from '../../shared/components/boton/boton.component';
import {CuadroCarritoComponent} from './components/cuadro-carrito/cuadro-carrito.component';

@Component({
  selector: 'app-carrito',
  imports: [
    BotonComponent,
    CuadroCarritoComponent
  ],
  templateUrl: './carrito.component.html',
  standalone: true,
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

}
