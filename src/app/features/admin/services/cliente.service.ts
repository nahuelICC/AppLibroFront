import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioTablaDTO} from '../DTO/UsuarioTablaDTO';
import {ClientesTablaDTO} from '../DTO/ClientesTablaDTO';
import {environment} from '../../../../environments/environment';

/**
 * Servicio que gestiona los clientes
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = '/api/clientes';
  private baseUrl = environment.baseURL;
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los usuarios de la tabla
   */
  getClientesTabla(): Observable<ClientesTablaDTO[]>{
    return this.http.get<ClientesTablaDTO[]>(`${this.baseUrl}${this.apiUrl}/admin/clientesTabla`)
  }

  /**
   * Obtiene los datos de un cliente
   * @param item
   */
  modificarCliente(item: any): Observable<any> {
  return this.http.put(`${this.baseUrl}${this.apiUrl}/admin/modCliente`, item);
  }
}
