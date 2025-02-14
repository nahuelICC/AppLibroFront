import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeneroDTO} from '../../tienda/DTOs/GeneroDTO';
import {IdiomaDTO} from '../DTO/IdiomaDTO';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = '/api/libros';

  constructor(private http: HttpClient) { }

  getGeneros(): Observable<GeneroDTO[]> {
    return this.http.get<GeneroDTO[]>(`${this.apiUrl}/generos`);
  }

  getIdiomas(): Observable<IdiomaDTO[]>{
    return this.http.get<IdiomaDTO[]>(`${this.apiUrl}/idiomas`);
  }
}
