import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResenyaService {

  private apiUrl = 'http://localhost:8000/api/resenya'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getMediaResenya(libroId: number): Observable<{ average_rating: number }> {
    return this.http.get<{ average_rating: number }>(`${this.apiUrl}/mediaresenya/${libroId}`);
  }

  countResenyas(libroId: number): Observable<{ total_resenyas: number }> {
    return this.http.get<{ total_resenyas: number }>(`${this.apiUrl}/count/${libroId}`);
  }

  getResenyas(libroId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${libroId}`);
  }


}
