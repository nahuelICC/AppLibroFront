import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {NotificacionesDTO} from '../DTOs/NotificacionesDTO';
import {AuthServiceService} from '../../core/services/auth-service.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private apiUrl = '/api/notificaciones';
  private baseUrl = environment.baseURL;
  private apiUrlCliente = '/api/clientes';
  private notificacionesCountSubject = new BehaviorSubject<number>(0);
  notificacionesCount$ = this.notificacionesCountSubject.asObservable();

  constructor(private  http: HttpClient, private authService: AuthServiceService) { }

  /**
  * Obtener notificaciones de un usuario
   */
  getNotificacionesDeUsuario(id_usuario: number): Observable<NotificacionesDTO[]> {
    return this.http.get<NotificacionesDTO[]>(`${this.baseUrl}${this.apiUrl}/cliente/${id_usuario}`);
  }

  /*
  * obtener id de usuario
   */
  obtenerIdUsuario(): Observable<{ id_usuario: number }> {
    return this.http.get<{ id_usuario: number }>(`${this.baseUrl}${this.apiUrlCliente}/usuario/id`);
  }
  /*
  * Marcar todas las notificaciones como leídas
   */
  marcarTodasComoLeidas(id_usuario: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}${this.apiUrl}/marcarleidas/${id_usuario}`, {});
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
