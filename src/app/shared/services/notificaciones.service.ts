import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NotificacionesDTO} from '../DTOs/NotificacionesDTO';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private apiUrl = '/api/notificaciones';
  private apiUrlCliente = '/api/clientes';

  constructor(private  http: HttpClient) { }

  getNotificacionesDeUsuario(id_usuario: number): Observable<NotificacionesDTO[]> {
    return this.http.get<NotificacionesDTO[]>(`${this.apiUrl}/cliente/${id_usuario}`);
  }

  obtenerIdUsuario(): Observable<{ id_usuario: number }> {
    return this.http.get<{ id_usuario: number }>(`${this.apiUrlCliente}/usuario/id`);
  }
  marcarTodasComoLeidas(id_usuario: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/marcarleidas/${id_usuario}`, {});
  }



}
