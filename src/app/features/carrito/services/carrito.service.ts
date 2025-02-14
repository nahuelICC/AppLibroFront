import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

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

  getLibroTipo(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCarrito/${id}`);
  }

  postPedido(pedido: any, total:number,direccion:string): Observable<any> {
    return this.http.post(this.apiPedidoUrl, {total: total.toString(), direccion: direccion, pedido: pedido});
  }

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


  updateCartItemCount() {
    const totalQuantity = this.cartItems.reduce(
      (total, item) => total + item.cantidad,
      0
    );
    this.cartItemCountSource.next(totalQuantity);
  }

  updateCartInLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.updateCartItemCount();
    }
  }



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

  clearCart() {
    this.cartItems = [];
    this.updateCartInLocalStorage();
    this.updateCartItemCount();
  }

  compruebaSuscrito(): Observable<any> {
    return this.http.get(`${this.apiClienteSuscripcionUrl}/compruebaSuscripcion`);
  }


}
