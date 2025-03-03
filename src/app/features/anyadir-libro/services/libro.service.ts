import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeneroDTO} from '../../tienda/DTOs/GeneroDTO';
import {IdiomaDTO} from '../DTO/IdiomaDTO';

/**
 * Servicio que gestiona los libros
 */
@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = '/api/libros';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los géneros
   */
  getGeneros(): Observable<GeneroDTO[]> {
    return this.http.get<GeneroDTO[]>(`${this.apiUrl}/generos`);
  }

  /**
   * Obtiene los idiomas
   */
  getIdiomas(): Observable<IdiomaDTO[]>{
    return this.http.get<IdiomaDTO[]>(`${this.apiUrl}/idiomas`);
  }

  /**
   * Obtiene los libros de la tabla
   * @param libro
   */
  postLibro(libro: any): Observable<Object> {
    return this.http.post(`${this.apiUrl}/admin/crearLibro`, libro);
  }

  /**
   * Obtiene los libros de la tabla
   * @param id
   */
  getLibroById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/libro/${id}`);
  }

  /**
   * Obtiene los libros de la tabla
   * @param id
   * @param data
   */
  putLibro(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/actualizarLibro/${id}`, data);
  }
}
