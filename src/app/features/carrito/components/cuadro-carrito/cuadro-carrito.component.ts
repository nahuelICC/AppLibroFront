import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CurrencyPipe} from '@angular/common';


/**
 * Componente que gestiona los elementos del carrito
 */
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
  @Input() id: number = 0;
  @Input() cantidad: number = 0;
  @Input() precio: number = 0;
  @Input() tipoTapa: string = '';


  @Output() quantityUpdated = new EventEmitter<{ id: number; cantidad: number }>();

  /**
   * Actualiza la cantidad de producto del carrito
   * @private
   */
  private emitQuantityUpdate() {
    this.quantityUpdated.emit({ id: this.id, cantidad: this.cantidad });
  }

  /**
   * Incrementa la cantidad de producto del carrito
   */
  incrementQuantity() {
    if (this.cantidad < 10) {
      this.cantidad++;
      this.emitQuantityUpdate();
    }
  }

  /**
   * Decrementa la cantidad de producto del carrito
   */
  decrementQuantity() {
    if (this.cantidad > 1) {
      this.cantidad--;
      this.emitQuantityUpdate();
    } else if (this.cantidad === 1) {
      this.cantidad = 0;
      this.emitQuantityUpdate();
    }
  }


}
