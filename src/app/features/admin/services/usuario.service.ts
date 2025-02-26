import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioTablaDTO} from '../DTO/UsuarioTablaDTO';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = '/api/usuario';
  private baseUrl = environment.baseURL;
  constructor(private http: HttpClient) { }

  getUsuariosTabla(): Observable<UsuarioTablaDTO[]>{
    return this.http.get<UsuarioTablaDTO[]>(`${this.baseUrl}${this.apiUrl}/usuarios`)
  }
  modificarUsuario(usuario: UsuarioTablaDTO): Observable<any> {
    // Se asume que el objeto usuario tiene el id asignado
    return this.http.put(`${this.baseUrl}${this.apiUrl}/${usuario.id}`, usuario);
  }

}
