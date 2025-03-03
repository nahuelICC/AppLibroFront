import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * Servicio que gestiona los libros
 */
@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private apiUrl = '/api/libros';
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los libros de la tabla
   */
  getLibrosTabla(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/admin/librosTabla`);
  }
}
