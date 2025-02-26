import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CarritoService } from './services/carrito.service';
import {Router, RouterLink} from '@angular/router';
import {CuadroCarritoComponent} from './components/cuadro-carrito/cuadro-carrito.component';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {BotonComponent} from '../../shared/components/boton/boton.component';

/**
 * Componente que gestiona el carrito
 */
@Component({
  selector: 'app-carrito',
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf,
    MatIcon,
    MatTooltip,
    CuadroCarritoComponent,
    MatTooltip,
    MatIcon,
    BotonComponent,
    RouterLink
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
  tipoSuscripcion: number = 0;

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService,
  ) {
    this.cartItems = this.carritoService.cartItems;
  }

  ngOnInit(): void {
    this.loadCartFromLocalStorage();
    this.carritoService.compruebaSuscrito().subscribe(
      (response: any) => {
        this.tipoSuscripcion = response;
        this.calculateTotalPrice(); // Recalcular precios tras obtener el tipo de suscripción
      },
      (error) => {
        console.error('Error fetching subscription details:', error);
      }
    );
  }

  /**
   * Actualiza la cantidad y el precio de productos en el carrito
   * @param event
   */
  onQuantityUpdated(event: { id: number; cantidad: number }) {
    const { id, cantidad } = event;
    this.carritoService.updateItemQuantity(id, cantidad);
    this.updateProductQuantity(id, cantidad);
    this.calculateTotalPrice(); // Recalcular precios tras cambiar la cantidad
  }

  /**
   * Carga el carrito desde el local storage
   */
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

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param idTipo
   * @param cantidad
   */
  updateProductQuantity(idTipo: number, cantidad: number) {
    const productIndex = this.products.findIndex((product) => product.id_tipo === idTipo);
    if (productIndex !== -1) {
      if (cantidad > 0) {
        this.products[productIndex].cantidad = cantidad;
      } else {
        this.products.splice(productIndex, 1);
        if (this.products.length === 0) {
          this.clearCart();
        }
      }
    }
  }

  /**
   * Calcula el precio total de los productos del carrito
   */
  calculateTotalPrice() {
    this.totalBooksPrice = 0;

    // Calcular el precio total sin descuento
    this.products.forEach((product) => {
      this.totalBooksPrice += product.precio * product.cantidad;
    });

    // Aplicar descuento según el tipo de suscripción
    this.calculadescuento();

    // Actualizar costo de envío
    this.updateShippingCost();
  }

  /**
   * Calcula el descuento a aplicar según el tipo de suscripción
   * @private
   */
  private calculadescuento() {
    this.discount = 0;

    if (this.tipoSuscripcion === 1) {
      this.discount = this.totalBooksPrice * 0.05;
    } else if (this.tipoSuscripcion === 2) {
      this.discount = this.totalBooksPrice * 0.10;
    } else if (this.tipoSuscripcion === 3) {
      this.discount = this.totalBooksPrice * 0.15;
    }
  }

  /**
   * Obtiene los detalles de los productos del carrito
   */
  fetchProductDetails() {
    this.products = [];
    this.totalBooksPrice = 0;

    this.cartItems.forEach((item: any) => {
      const idLibroTipo = item.id;
      this.carritoService.getLibroTipo(idLibroTipo).subscribe(
        (response: any) => {
          const product = response;
          if (product) {
            product.id_tipo = idLibroTipo;
            product.cantidad = item.cantidad;
            this.products.push(product);

            // Asegurarse de recalcular el precio total tras agregar cada producto
            this.calculateTotalPrice();
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

  /**
   * Actualiza el precio de envío
   */
  updateShippingCost() {
    if (this.totalBooksPrice > 50 || this.totalBooksPrice === 0 || this.tipoSuscripcion !== 0) {
      this.shippingCost = 0;
    } else {
      this.shippingCost = 5;
    }

    // Guardar el precio total en localStorage
    localStorage.setItem('total', JSON.stringify(this.totalBooksPrice));
  }

  /**
   * Elimina los elementos del carrito
   */
  clearCart() {
    this.cartItems = [];
    this.products = [];
    this.totalBooksPrice = 0;
    this.shippingCost = 5;
    this.discount = 0;
    this.carritoService.clearCart();
    localStorage.removeItem('cart');
  }
}
