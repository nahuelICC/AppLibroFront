import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioTablaDTO} from '../DTO/UsuarioTablaDTO';
import {environment} from '../../../../environments/environment';

/**
 * Servicio que gestiona los usuarios
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = '/api/usuario';
  private baseUrl = environment.baseURL;
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los usuarios de la tabla
   */
  getUsuariosTabla(): Observable<UsuarioTablaDTO[]>{
    return this.http.get<UsuarioTablaDTO[]>(`${this.baseUrl}${this.apiUrl}/usuarios`)
  }

  /**
   * Obtiene los datos de un usuario
   * @param usuario
   */
  modificarUsuario(usuario: UsuarioTablaDTO): Observable<any> {
    // Se asume que el objeto usuario tiene el id asignado
    return this.http.put(`${this.baseUrl}${this.apiUrl}/${usuario.id}`, usuario);
  }

}
