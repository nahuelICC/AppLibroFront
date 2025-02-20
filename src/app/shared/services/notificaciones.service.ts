import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {NotificacionesDTO} from '../DTOs/NotificacionesDTO';
import {AuthServiceService} from '../../core/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private apiUrl = '/api/notificaciones';
  private apiUrlCliente = '/api/clientes';
  private notificacionesCountSubject = new BehaviorSubject<number>(0);
  notificacionesCount$ = this.notificacionesCountSubject.asObservable();

  constructor(private  http: HttpClient, private authService: AuthServiceService) { }

  getNotificacionesDeUsuario(id_usuario: number): Observable<NotificacionesDTO[]> {
    return this.http.get<NotificacionesDTO[]>(`${this.apiUrl}/cliente/${id_usuario}`);
  }

  obtenerIdUsuario(): Observable<{ id_usuario: number }> {
    return this.http.get<{ id_usuario: number }>(`${this.apiUrlCliente}/usuario/id`);
  }
  marcarTodasComoLeidas(id_usuario: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/marcarleidas/${id_usuario}`, {});
  }

  actualizarCantidadNotificaciones(): void {
    if (!this.authService.isLogged()) {
      this.notificacionesCountSubject.next(0);
      return;
    }

    this.obtenerIdUsuario().subscribe({
      next: (data) => {
        const userId = data.id_usuario;
        this.getNotificacionesDeUsuario(userId).subscribe((notificaciones) => {
          const count = notificaciones.filter((notificacion) => !notificacion.leida).length;
          this.notificacionesCountSubject.next(count);
        });
      },
      error: () => {
        this.notificacionesCountSubject.next(0);
      }
    });
  }




}
