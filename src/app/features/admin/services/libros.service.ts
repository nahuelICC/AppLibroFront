import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private apiUrl = '/api/libros';
  constructor(private http: HttpClient) { }

  getLibrosTabla(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/admin/librosTabla`);
  }
}
