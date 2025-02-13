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
  @Input() id: number = 0;
  @Input() cantidad: number = 0;
  @Input() precio: number = 0;
  @Input() tipoTapa: string = '';


  @Output() quantityUpdated = new EventEmitter<{ id: number; cantidad: number }>();

  private emitQuantityUpdate() {
    this.quantityUpdated.emit({ id: this.id, cantidad: this.cantidad }); // ✅ Usar id
  }

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


}
