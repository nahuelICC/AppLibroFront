import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private apiUrl = '/api/libroTipo';
  private baseUrl = environment.baseURL;
  constructor(private http: HttpClient) { }

  getLibrosTabla(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}${this.apiUrl}/admin/libroTipoTabla`);
  }

  modifcarLibro(item:any): Observable<any>{
    return this.http.put(`${this.baseUrl}${this.apiUrl}/admin/modLibroTipo`, item);
  }
}
