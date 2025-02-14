import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasarelaPagoService {

  private apiUrl = '/api/clientes';
  private apiUrlSuscripcion = '/api/suscripcion';

  constructor(private  http: HttpClient) { }

  getDireccionTelefono(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getDataDireccion`);
  }

  crearSuscripcion(idCliente: number, tipoSuscripcion: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrlSuscripcion}/nueva/${idCliente}/${tipoSuscripcion}`, data);
  }

}
