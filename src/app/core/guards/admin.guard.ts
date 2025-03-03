import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

/**
 * Guard que comprueba si el usuario está logueado y es administrador
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}

  /**
   * Comprueba si el usuario está logueado y es administrador
   */
  canActivate(): boolean {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/main']); // Pendiente de cambiar a página de error
      return false;
    }

    return true;
  }
}
