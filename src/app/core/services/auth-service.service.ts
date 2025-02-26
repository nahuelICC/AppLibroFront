import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private tokenKey = 'token';
  private loggedKey = 'logged';
  private apiClienteSuscripcionUrl = '/api/ClienteSuscripcion';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLogged());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.loggedKey, 'true');
    this.isLoggedInSubject.next(true); // Notificar a los componentes que el usuario ha iniciado sesión

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
    this.isLoggedInSubject.next(false); // Notificar que el usuario cerró sesión
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
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles && payload.roles.includes('ROLE_ADMIN');
  }
}
