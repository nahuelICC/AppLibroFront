import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';


/**
 * Servicio que gestiona los detalles de un libro
 */
@Injectable({
  providedIn: 'root'
})
export class DetallesLibroService {

  private apiUrlResenya = '/api/resenya';
  private apiUrlCliente = '/api/clientes';
  private baseUrl = environment.baseURL;
  private apiUrlNotificaciones = '/api/notificaciones';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la media de las reseñas de un libro
   * @param libroId
   */
  getMediaResenya(libroId: number): Observable<{ average_rating: number }> {
    return this.http.get<{ average_rating: number }>(`${this.baseUrl}${this.apiUrlResenya}/mediaresenya/${libroId}`);
  }

  /**
   * Obtiene las reseñas de un libro
   * @param libroId
   */
  getResenyas(libroId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${this.apiUrlResenya}/${libroId}`);
  }

  /**
   * Añade una reseña
   * @param resenya
   */
  addResenya(resenya: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}${this.apiUrlResenya}/nuevaresenya`, resenya, { headers });
  }

  /**
   * Elimina una reseña
   * @param id
   */
  deleteResenya(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.apiUrlResenya}/eliminar/${id}`);
  }

  /**
   * Obtiene el id del cliente
   */
  obtenerIdCliente(): Observable<{ id_cliente: number }> {
    return this.http.get<{ id_cliente: number }>(`${this.baseUrl}${this.apiUrlCliente}/id`);
  }

  /**
   * Denuncia una reseña
   * @param id
   */
  postDenuciarResenya(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.apiUrlNotificaciones}/notificacionDenuncia`, {id_resenya: id});
  }


}
