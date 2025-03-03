import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasarelaPagoService {

  private apiUrl = '/api/clientes';
  private apiUrlSuscripcion = '/api/suscripcion';
  private baseUrl = environment.baseURL;

  constructor(private  http: HttpClient) { }


  /**
   * Obtener la dirección y el teléfono del cliente
   */
  getDireccionTelefono(): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.apiUrl}/getDataDireccion`);
  }

  /**
   * crear una nueva suscripción
   */
  crearSuscripcion(idCliente: number, tipoSuscripcion: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.apiUrlSuscripcion}/nueva/${idCliente}/${tipoSuscripcion}`, data);
  }

}
