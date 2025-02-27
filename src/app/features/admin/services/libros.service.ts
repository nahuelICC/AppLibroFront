import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private baseUrl = environment.baseURL;
  private apiUrl = '/api/libros';
  constructor(private http: HttpClient) { }

  getLibrosTabla(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}${this.apiUrl}/admin/librosTabla`);
  }
}
