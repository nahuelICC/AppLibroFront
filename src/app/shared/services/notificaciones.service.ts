import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private apiUrl = '/api/notificaciones';
  private apiUrlCliente = '/api/clientes';

  constructor(private  http: HttpClient) { }

  getNotificacionesDeCliente(id_cliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/${id_cliente}`);
  }

  obtenerIdCliente(): Observable<{ id_cliente: number }> {
    return this.http.get<{ id_cliente: number }>(`${this.apiUrlCliente}/id`);
  }


}
