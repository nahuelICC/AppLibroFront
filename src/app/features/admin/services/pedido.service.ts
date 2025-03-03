import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PedidosTablaDTO} from '../DTO/PedidosTablaDTO';

/**
 * Servicio que gestiona los pedidos
 */
@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = '/api/pedido';
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los pedidos de la tabla
   */
  getPedidosTabla(): Observable<PedidosTablaDTO[]>{
    return this.http.get<PedidosTablaDTO[]>(`${this.apiUrl}/admin/pedidosTabla`);
  }

  /**
   * Obtiene los estados
   */
  getEstados(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/estados`);
  }

  /**
   * Modifica un pedido
   * @param item
   */
  modificarPedido(item: any) : Observable<any>{
    return this.http.put(`${this.apiUrl}/admin/modPedido`, item);
  }
}
