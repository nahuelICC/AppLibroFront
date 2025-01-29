import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-detalle-precio',
  imports: [
    BotonComponent
  ],
  templateUrl: './detalle-precio.component.html',
  standalone: true,
  styleUrl: './detalle-precio.component.css'
})
export class DetallePrecioComponent implements OnChanges{
  @Input() precios: { blanda: number | null, dura: number | null } = { blanda: null, dura: null };
  @Input() tiposTapa: any[] = [];
  @Input() libroId: number | null = null;
  price: number = 0;
  quantity: number = 1;
  coverType: string = 'Tapa dura';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['precios']) {
      this.updatePrice();
    }
  }

  updateQuantity(amount: number) {
    if (this.quantity + amount > 0) {
      this.quantity += amount;
      // this.updatePrice(); // Actualiza el precio cuando cambia la cantidad
    }
  }

  selectCover(type: string) {
    this.coverType = type;
    this.quantity = 1; // Reinicia la cantidad a 1
    this.updatePrice(); // Actualiza el precio
  }

  updatePrice() {
    let basePrice = 0;
    if (this.coverType === 'Tapa dura' && this.precios.dura !== null) {
      basePrice = this.precios.dura;
    } else if (this.coverType === 'Tapa blanda' && this.precios.blanda !== null) {
      basePrice = this.precios.blanda;
    }
    this.price = basePrice;
    // this.price = basePrice * this.quantity;// Multiplica el precio base por la cantidad
  }

  anadirAlCarrito() {
    if (this.libroId === null) {
      console.error('ID del libro no definido');
      return;
    }

    // Crear el objeto con los datos del libro
    const cartItem = {
      libroId: this.libroId,
      tipoTapa: this.coverType,
      cantidad: this.quantity
    };

    // Obtener el carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Añadir el nuevo ítem al carrito
    cart.push(cartItem);

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    console.log('Libro añadido al carrito:', cartItem);
    alert('Libro añadido al carrito');
  }

}
