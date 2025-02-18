import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {EditaUsuarioDTO} from '../DTOs/EditaUsuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  private apiUrl = '/api/clientes';
  private apiUrlPedido = '/api/lineaLibro';
  private apiUrlUsuario = '/api/usuario';
  private apiUrlClienteSuscripcion = '/api/ClienteSuscripcion';

  constructor(private http: HttpClient) { }

  getDatosCliente(): Observable<any> {
    return this.http.get(`${this.apiUrl}/datos`);
  }

  getDetallesPedido(id:number): Observable<any> {
    return this.http.get(`${this.apiUrlPedido}/pedidos/${id}`);
  }

  putEdicionPerfil(datos: EditaUsuarioDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar`, datos);
  }

  putEdicionDireccion(datos: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/direccion`, { direccion: datos });
  }

  postCambioContrasena(datos: { actual: string, nueva: string, repetir: string }): Observable<any> {
    return this.http.post(`${this.apiUrlUsuario}/cambioContrasenya`, datos);
  }

  putEditarEstado(estado:boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/editarEstado`, { estado: estado });
  }

  putEditarGenero(genero:number): Observable<any> {
    return this.http.put(`${this.apiUrlClienteSuscripcion}/cambiaGenero`, { genero: genero });
  }

  putEditarTipoSuscripcion(tipo: number | null, genero: number): Observable<any> {
    return this.http.put(`${this.apiUrlClienteSuscripcion}/cambiaTipoSuscripcion`, { tipo: tipo, genero:genero });
  }

  rolUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrlUsuario}/rol`);
  }

}
