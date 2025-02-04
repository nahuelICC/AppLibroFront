import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() idTipo: number = 0;
  @Input() cantidad: number = 0;
  @Input() precio: number = 0;

  @Output() quantityUpdated = new EventEmitter<{ idTipo: number; cantidad: number }>();

  incrementQuantity() {
    if (this.cantidad < 10) {
      this.cantidad++;
      this.emitQuantityUpdate();
    }
  }

  decrementQuantity() {
    if (this.cantidad > 1) {
      this.cantidad--;
      this.emitQuantityUpdate();
    } else if (this.cantidad === 1) {
      this.cantidad = 0;
      this.emitQuantityUpdate();
    }
  }

  private emitQuantityUpdate() {
    this.quantityUpdated.emit({ idTipo: this.idTipo, cantidad: this.cantidad });
  }

}
