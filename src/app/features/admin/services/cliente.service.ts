import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioTablaDTO} from '../DTO/UsuarioTablaDTO';
import {ClientesTablaDTO} from '../DTO/ClientesTablaDTO';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = '/api/clientes';
  constructor(private http: HttpClient) { }

  getClientesTabla(): Observable<ClientesTablaDTO[]>{
    return this.http.get<ClientesTablaDTO[]>(`${this.apiUrl}/admin/clientesTabla`)
  }

  modificarCliente(item: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/admin/modCliente`, item);
  }
}
