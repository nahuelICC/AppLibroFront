import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormControl, ɵValue} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class CambioPasswordService {
  private apiUrl = '/api/usuario';

  constructor(private http:HttpClient) { }

  solicitarCambioPassword(email: ɵValue<FormControl<string | null>> | undefined) {
    return this.http.post(`${this.apiUrl}/solicitaCambio`, { email });
  }

  validaToken(token: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(
      `${this.apiUrl}/validarToken/${encodeURIComponent(token)}` // Codifica el token por seguridad
    );
  }

  resetPassword(token: string, password: ɵValue<FormControl<string | null>> | undefined, confirmPassword: ɵValue<FormControl<string | null>> | undefined): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambioContrasenyaToken`, { token, password, confirmPassword });
  }


}
