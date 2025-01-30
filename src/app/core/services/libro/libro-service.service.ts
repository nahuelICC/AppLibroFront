import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CuadroProducto} from '../../../features/tienda/DTOs/CuadroProducto';
import {LibroDetalle} from '../../../features/detalles_libro/DTOs/LibroDetalle';
import { LibroDetalleResponse } from '../../../features/detalles_libro/DTOs/LibroDetalleResponse';

@Injectable({
  providedIn: 'root',  // Esto hace que el servicio esté disponible globalmente, sin necesidad de importarlo en módulos
})
export class LibroServiceService {
  private apiUrl = '/api/libros';

  constructor(private http: HttpClient) {}

  getLibros(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getPrincipal(): Observable<CuadroProducto[]> {
    return this.http.get<CuadroProducto[]>(`${this.apiUrl}/principal`);
  }

  getLibroDetalle(id: number): Observable<LibroDetalleResponse> {
    return this.http.get<LibroDetalleResponse>(`${this.apiUrl}/detalle/${id}`);
  }

}
