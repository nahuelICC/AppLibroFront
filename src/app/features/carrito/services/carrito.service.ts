import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = '/api/libroTipo';

  constructor(private http: HttpClient) { }

  getLibroTipo(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCarrito/${id}`);
  }
}
