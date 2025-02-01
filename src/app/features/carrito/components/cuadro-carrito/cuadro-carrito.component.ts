import {Component, Input} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-cuadro-carrito',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './cuadro-carrito.component.html',
  standalone: true,
  styleUrl: './cuadro-carrito.component.css'
})
export class CuadroCarritoComponent {
  @Input() portada: string = '';
  @Input() titulo: string = '';
  @Input() cantidad: number = 0;
  @Input() precio: number = 0;

}
