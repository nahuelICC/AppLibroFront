import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio para la página de inicio
 */
@Injectable({
  providedIn: 'root'
})
export class InicioService {

  private apiUrlSuscripcion = '/api/suscripcion';

  constructor(private http: HttpClient) { }

  /**
   * Función para obtener las suscripciones
   */
  obtenerSuscripciones(): Observable<any> {
    return this.http.get(`${this.apiUrlSuscripcion}/todasinicio`);
  }


}
