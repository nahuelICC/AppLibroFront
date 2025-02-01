import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesLibroService {

  private apiUrlResenya = '/api/resenya';
  private apiUrlCliente = '/api/clientes';
  private apiUrlTapa= 'api/tipoTapa';

  constructor(private http: HttpClient) { }

  getMediaResenya(libroId: number): Observable<{ average_rating: number }> {
    return this.http.get<{ average_rating: number }>(`${this.apiUrlResenya}/mediaresenya/${libroId}`);
  }

  countResenyas(libroId: number): Observable<{ total_resenyas: number }> {
    return this.http.get<{ total_resenyas: number }>(`${this.apiUrlResenya}/count/${libroId}`);
  }

  getResenyas(libroId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlResenya}/${libroId}`);
  }

  addResenya(resenya: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrlResenya}/nuevaresenya`, resenya, { headers });
  }

  deleteResenya(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlResenya}/eliminar/${id}`);
  }

  obtenerIdCliente(): Observable<{ id_cliente: number }> {
    return this.http.get<{ id_cliente: number }>(`${this.apiUrlCliente}/id`);
  }

  getPrecioTapa(id_libro: number, id_tipo_tapa: number): Observable<{ id_tipo: number, precio: number }> {
    return this.http.get<{ id_tipo: number, precio: number }>(`${this.apiUrlTapa}/precio/${id_libro}/${id_tipo_tapa}`);
  }


}
