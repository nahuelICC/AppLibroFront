import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

/**
 * Servicio que gestiona el carrito de la compra
 */
@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = '/api/libroTipo';
  private apiPedidoUrl = '/api/pedido';
  private apiClienteSuscripcionUrl = '/api/ClienteSuscripcion';
  cartItems: any[] = [];
  private cartItemCountSource = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCountSource.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los libros del carrito
   * @param id
   */
  getLibroTipo(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCarrito/${id}`);
  }

  /**
   * Realiza un pedido
   * @param pedido
   * @param total
   * @param direccion
   */
  postPedido(pedido: any, total:number,direccion:string): Observable<any> {
    return this.http.post(this.apiPedidoUrl, {total: total.toString(), direccion: direccion, pedido: pedido});
  }


  /**
   * Añade un elemento al carrito
   * @param item
   */
  addItemToCart(item: any) {
    const existingItemIndex = this.cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].cantidad += item.cantidad;
    } else {
      this.cartItems.push(item);
    }

    this.updateCartInLocalStorage();
    this.updateCartItemCount();
  }

  /**
   * Actualiza el contador de elementos en el carrito
   */
  updateCartItemCount() {
    const totalQuantity = this.cartItems.reduce(
      (total, item) => total + item.cantidad,
      0
    );
    this.cartItemCountSource.next(totalQuantity);
  }

  /**
   * Actualiza el carrito en el local storage
   */
  updateCartInLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  /**
   * Carga el carrito desde el local storage
   */
  loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.updateCartItemCount();
    }
  }

  /**
   * Actualiza la cantidad de un elemento del carrito
   * @param id
   * @param cantidad
   */
  updateItemQuantity(id: number, cantidad: number) {
    const itemIndex = this.cartItems.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      if (cantidad <= 0) {
        this.cartItems.splice(itemIndex, 1);
        if (this.cartItems.length === 0) {
          this.clearCart();
        }
      } else {
        this.cartItems[itemIndex].cantidad = cantidad;
      }

      this.updateCartInLocalStorage();
      this.updateCartItemCount();
    }
  }

  /**
   * Elimina todos los elementos del carrito
   */
  clearCart() {
    this.cartItems = [];
    this.updateCartInLocalStorage();
    this.updateCartItemCount();
  }

  /**
   * Comprueba si el usuario tiene suscripción y el tipo que es
   */
  compruebaSuscrito(): Observable<any> {
    return this.http.get(`${this.apiClienteSuscripcionUrl}/compruebaSuscripcion`);
  }


}
