import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CuadroProducto} from '../../../features/tienda/DTOs/CuadroProducto';
import { VerificarCompraResponse } from '../../../features/detalles_libro/DTOs/VerificarCompraResponse';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',  // Esto hace que el servicio esté disponible globalmente, sin necesidad de importarlo en módulos
})
export class LibroServiceService {
  private apiUrl = '/api/libros';
  private baseUrl = environment.baseURL;


  constructor(private http: HttpClient) {}


  getPrincipal(): Observable<CuadroProducto[]> {
    return this.http.get<CuadroProducto[]>(`${this.baseUrl}${this.apiUrl}/principal`);
  }

  getLibroDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.apiUrl}/detalle/${id}`);
  }

  verificarCompra(libroId: number, clienteId: number): Observable<VerificarCompraResponse> {
    return this.http.get<VerificarCompraResponse>(`${this.baseUrl}${this.apiUrl}/verificarcompra/${libroId}/${clienteId}`);
  }

  getNovedades(): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.apiUrl}/novedades`);
  }

  getMasVendidos(): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.apiUrl}/masvendidos`);
  }


}
