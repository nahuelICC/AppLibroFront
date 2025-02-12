// src/app/core/services/auth-service.service.ts
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private tokenKey = 'token';
  private loggedKey = 'logged';
  private apiClienteSuscripcionUrl = '/api/ClienteSuscripcion';

  constructor(private http: HttpClient, private router: Router) {}

  // Almacena el token en localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.loggedKey, 'true');
    this.isSuscribed().subscribe(isSuscribed => localStorage.setItem('isSuscribed', isSuscribed));
  }

  // Obtiene el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Elimina el token y el estado de logged
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.loggedKey);
  }

  // Verifica si el usuario está logueado
  isLogged(): boolean {
    return localStorage.getItem(this.loggedKey) === 'true';

  }

  // Cierra la sesión y redirige al usuario
  logout(): void {
    this.clearToken();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isSuscribed(): Observable<string> {
    return this.http.get<number>(`${this.apiClienteSuscripcionUrl}/compruebaSuscripcion`).pipe(
      map(response => response !== 0 ? 'true' : 'false')
    );
  }
}
