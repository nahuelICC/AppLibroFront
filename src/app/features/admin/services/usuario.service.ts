import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioTablaDTO} from '../DTO/UsuarioTablaDTO';

/**
 * Servicio que gestiona los usuarios
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = '/api/usuario';
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los usuarios de la tabla
   */
  getUsuariosTabla(): Observable<UsuarioTablaDTO[]>{
    return this.http.get<UsuarioTablaDTO[]>(`${this.apiUrl}/usuarios`)
  }

  /**
   * Obtiene los datos de un usuario
   * @param usuario
   */
  modificarUsuario(usuario: UsuarioTablaDTO): Observable<any> {
    // Se asume que el objeto usuario tiene el id asignado
    return this.http.put(`${this.apiUrl}/${usuario.id}`, usuario);
  }

}
