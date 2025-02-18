import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioTablaDTO} from '../DTO/UsuarioTablaDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = '/api/usuario';
  constructor(private http: HttpClient) { }

  getUsuariosTabla(): Observable<UsuarioTablaDTO[]>{
    return this.http.get<UsuarioTablaDTO[]>(`${this.apiUrl}/usuarios`)
  }
  modificarUsuario(usuario: UsuarioTablaDTO): Observable<any> {
    // Se asume que el objeto usuario tiene el id asignado
    return this.http.put(`${this.apiUrl}/${usuario.id}`, usuario);
  }

}
