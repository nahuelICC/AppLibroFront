import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  private apiUrlSuscripcion = '/api/suscripcion';

  constructor(private http: HttpClient) { }

  obtenerSuscripciones(): Observable<any> {
    return this.http.get(`${this.apiUrlSuscripcion}/todasinicio`);
  }

  
}
