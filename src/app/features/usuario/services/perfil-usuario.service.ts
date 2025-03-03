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
  private apiUrlCancelar = 'api/pedido';

  constructor(private http: HttpClient) { }


  /**
    * Obtiene los datos del cliente.
   */
  getDatosCliente(): Observable<any> {
    return this.http.get(`${this.apiUrl}/datos`);
  }
  /**
    * Obtiene los datos del pedido.
   */
  getDetallesPedido(id:number): Observable<any> {
    return this.http.get(`${this.apiUrlPedido}/pedidos/${id}`);
  }
  /**
    * Método que permite editar el perfil.
   */
  putEdicionPerfil(datos: EditaUsuarioDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar`, datos);
  }
  /**
    * Método que permite editar la dirección.
   */
  putEdicionDireccion(datos: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/direccion`, { direccion: datos });
  }

  /**
    * Método que permite editar la contraseña.
   */
  postCambioContrasena(datos: { actual: string, nueva: string, repetir: string }): Observable<any> {
    return this.http.post(`${this.apiUrlUsuario}/cambioContrasenya`, datos);
  }
  /**
    * Método que permite editar el estado.
   */
  putEditarEstado(estado:boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/editarEstado`, { estado: estado });
  }
  /**
    * Método que permite editar el género de la suscripcion.
   */
  putEditarGenero(genero:number): Observable<any> {
    return this.http.put(`${this.apiUrlClienteSuscripcion}/cambiaGenero`, { genero: genero });
  }
  /**
    * Método que permite editar el tipo de suscripcion.
   */
  putEditarTipoSuscripcion(tipo: number | null, genero: number): Observable<any> {
    return this.http.put(`${this.apiUrlClienteSuscripcion}/cambiaTipoSuscripcion`, { tipo: tipo, genero:genero });
  }

  /**
    * Método que permite cancelar la suscripcion.
   */
  cancelarPedido(id: number): Observable<any> {
    return this.http.post(`${this.apiUrlCancelar}/cancelarpedido/${id}`, {});
  }

  /**
    * Método que permite obtener el rol del usuario.
   */
  rolUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrlUsuario}/rol`);
  }

}
