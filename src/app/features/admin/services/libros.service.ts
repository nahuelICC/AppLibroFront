import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private apiUrl = '/api/libroTipo';
  constructor(private http: HttpClient) { }

  getLibrosTabla(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/admin/libroTipoTabla`);
  }

  modifcarLibro(item:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/admin/modLibroTipo`, item);
  }
}
