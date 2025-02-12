import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PedidosTablaDTO} from '../DTO/PedidosTablaDTO';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = '/api/pedido';
  constructor(private http: HttpClient) { }

  getPedidosTabla(): Observable<PedidosTablaDTO[]>{
    return this.http.get<PedidosTablaDTO[]>(`${this.apiUrl}/admin/pedidosTabla`);
  }

  getEstados(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/estados`);
  }

  modificarPedido(item: any) : Observable<any>{
    return this.http.put(`${this.apiUrl}/admin/modPedido`, item);
  }
}
