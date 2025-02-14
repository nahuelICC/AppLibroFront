import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private tokenKey = 'token';
  private loggedKey = 'logged';
  private apiClienteSuscripcionUrl = '/api/ClienteSuscripcion';

  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.loggedKey, 'true');
    this.isSuscribed().subscribe(tipoSuscripcion => {
      localStorage.setItem('isSuscribed', tipoSuscripcion !== 0 ? 'true' : 'false');
      if (tipoSuscripcion !== 0) {
        localStorage.setItem('subscriptionType', tipoSuscripcion.toString());
      }
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.loggedKey);
  }

  isLogged(): boolean {
    return localStorage.getItem(this.loggedKey) === 'true';
  }

  logout(): void {
    this.clearToken();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  refreshLocalStorage(): void {
    this.isSuscribed().subscribe(tipoSuscripcion => {
      localStorage.setItem('isSuscribed', tipoSuscripcion !== 0 ? 'true' : 'false');
      if (tipoSuscripcion !== 0) {
        localStorage.setItem('subscriptionType', tipoSuscripcion.toString());
      }
    });
  }

  isSuscribed(): Observable<number> {
    return this.http.get<number>(`${this.apiClienteSuscripcionUrl}/compruebaSuscripcion`).pipe(
      map(response => {
        localStorage.setItem('isSuscribed', response !== 0 ? 'true' : 'false');
        if (response !== 0) {
          localStorage.setItem('subscriptionType', response.toString());
        }
        return response;
      })
    );
  }
}
