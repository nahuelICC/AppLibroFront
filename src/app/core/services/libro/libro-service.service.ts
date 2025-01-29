import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CuadroProducto} from '../../../features/tienda/DTOs/CuadroProducto';

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
}
