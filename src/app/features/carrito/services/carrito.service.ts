import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = '/api/libroTipo';
  private apiPedidoUrl = '/api/pedido';

  constructor(private http: HttpClient) { }

  getLibroTipo(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCarrito/${id}`);
  }

  postPedido(pedido: any, total:number,direccion:string): Observable<any> {
    return this.http.post(this.apiPedidoUrl, {total: total.toString(), direccion: direccion, pedido: pedido});
  }
}
