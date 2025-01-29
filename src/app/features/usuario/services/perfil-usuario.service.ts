import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  private apiUrl = 'http://localhost:8000/api/clientes';

  constructor(private http: HttpClient) { }

  getDatosCliente(): any {
    return this.http.get(`${this.apiUrl}/datos`);
  }
}
