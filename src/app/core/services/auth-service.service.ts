// src/app/core/services/auth-service.service.ts
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private tokenKey = 'token';
  private loggedKey = 'logged';

  constructor(private http: HttpClient, private router: Router) {}

  // Almacena el token en localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.loggedKey, 'true');
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
    this.router.navigate(['/main']);
  }
}
