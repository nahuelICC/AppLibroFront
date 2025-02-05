import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasarelaPagoService {

  private apiUrl = '/api/clientes';

  constructor(private  http: HttpClient) { }

  getDireccionTelefono(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getDataDireccion`);
  }
}
