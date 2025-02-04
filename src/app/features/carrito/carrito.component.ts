import {Component, OnInit} from '@angular/core';
import {BotonComponent} from '../../shared/components/boton/boton.component';
import {CuadroCarritoComponent} from './components/cuadro-carrito/cuadro-carrito.component';
import {HttpClient} from '@angular/common/http';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {CarritoService} from './services/carrito.service';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-carrito',
  imports: [
    BotonComponent,
    CuadroCarritoComponent,
    CurrencyPipe,
    NgForOf,
    RouterLink,
    NgIf,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './carrito.component.html',
  standalone: true,
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  cartItems: any[] = [];
  products: any[] = [];
  totalBooksPrice: number = 0;
  shippingCost: number = 5;
  discount: number = 0;

  constructor(private http: HttpClient, private carritoService: CarritoService,private router:Router) {}

  ngOnInit(): void {
    this.loadCartFromLocalStorage();
  }

  loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        this.cartItems = JSON.parse(cartData);
        this.fetchProductDetails();
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    } else {
      console.warn('El carrito está vacío.');
    }
  }

  updateCartItem(event: { idTipo: number; cantidad: number }) {
    const { idTipo, cantidad } = event;


    const cartIndex = this.cartItems.findIndex((item) => item.id_tipo === idTipo);

    if (cartIndex !== -1) {
      if (cantidad > 0) {

        this.cartItems[cartIndex].cantidad = cantidad;
      } else {

        this.cartItems.splice(cartIndex, 1);
      }

      localStorage.setItem('cart', JSON.stringify(this.cartItems));

      this.updateProductQuantity(idTipo, cantidad);

      this.calculateTotalPrice();
    }
  }

  updateProductQuantity(idTipo: number, cantidad: number) {
    const productIndex = this.products.findIndex((product) => product.id_tipo === idTipo);

    if (productIndex !== -1) {
      if (cantidad > 0) {
        // Actualizar la cantidad en products
        this.products[productIndex].cantidad = cantidad;
      } else {
        // Eliminar el producto de products si la cantidad es 0
        this.products.splice(productIndex, 1);
      }
    }
  }

  calculateTotalPrice() {
    this.totalBooksPrice = 0;

    this.products.forEach((product) => {
      this.totalBooksPrice += product.precio * product.cantidad;
    });

    this.updateShippingCost();
  }

  fetchProductDetails() {
    this.products = [];
    this.totalBooksPrice = 0;

    this.cartItems.forEach((item: any) => {
      const idLibroTipo = item.id_tipo;
      this.carritoService.getLibroTipo(idLibroTipo).subscribe(
        (response: any) => {
          const product = response;
          if (product) {
            product.id_tipo = idLibroTipo;
            product.cantidad = item.cantidad;
            this.products.push(product);


            this.totalBooksPrice += product.precio * product.cantidad;

            this.updateShippingCost();
          } else {
            console.warn(`Producto con ID ${idLibroTipo} no encontrado.`);
          }
        },
        (error) => {
          console.error(`Error fetching details for product ID ${idLibroTipo}:`, error);
        }
      );
    });
  }

  updateShippingCost() {
    if (this.totalBooksPrice > 50) {
      this.shippingCost = 0;
    } else {
      this.shippingCost = 5;
    }
  }

  clearCart() {
    this.cartItems = [];
    this.products = [];
    this.totalBooksPrice = 0;
    this.shippingCost = 5;
    this.discount = 0;
    localStorage.removeItem('cart');
  }


}
