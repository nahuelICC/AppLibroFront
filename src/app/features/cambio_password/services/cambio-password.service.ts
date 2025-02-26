import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormControl, ɵValue} from '@angular/forms';
import {environment} from '../../../../environments/environment';


/**
 * Servicio que gestiona el cambio de contraseña de un usuario
 */
@Injectable({
  providedIn: 'root'
})

export class CambioPasswordService {
  private apiUrl = '/api/usuario';
  private baseUrl = environment.baseURL;

  constructor(private http:HttpClient) { }

  /**
   * Endpoint que envia un correo con el token para cambiar la contraseña
   * @param email
   */
  solicitarCambioPassword(email: ɵValue<FormControl<string | null>> | undefined) {
    return this.http.post(`${this.baseUrl}${this.apiUrl}/solicitaCambio`, { email });
  }

  /**
   * Endpoint que valida el token para cambiar la contraseña
   * @param token
   */
  validaToken(token: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(
      `${this.baseUrl}${this.apiUrl}/validarToken/${encodeURIComponent(token)}` // Codifica el token por seguridad
    );
  }

  /**
   * Endpoint que cambia  la contraseña
   * @param token
   * @param password
   * @param confirmPassword
   */
  resetPassword(token: string, password: ɵValue<FormControl<string | null>> | undefined, confirmPassword: ɵValue<FormControl<string | null>> | undefined): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.apiUrl}/cambioContrasenyaToken`, { token, password, confirmPassword });
  }


}
