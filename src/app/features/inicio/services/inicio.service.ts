import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';

/**
 * Servicio para la página de inicio
 */
@Injectable({
  providedIn: 'root'
})
export class InicioService {

  private apiUrlSuscripcion = '/api/suscripcion';
  private baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  /**
   * Función para obtener las suscripciones
   */
  obtenerSuscripciones(): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.apiUrlSuscripcion}/todasinicio`);
  }


}
