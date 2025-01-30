import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  private apiUrl = 'http://localhost:8000/api/clientes';
  private apiUrlPedido = 'http://localhost:8000/api/lineaLibro';

  constructor(private http: HttpClient) { }

  getDatosCliente(): Observable<any> {
    return this.http.get(`${this.apiUrl}/datos`);
  }

  getDetallesPedido(id:number): Observable<any> {
    return this.http.get(`${this.apiUrlPedido}/pedidos/${id}`);
  }
}
