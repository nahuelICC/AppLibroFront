import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

/**
 * Guard que comprueba si el usuario está logueado
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}

  /**
   * Comprueba si el usuario está logueado
   */
  canActivate(): boolean {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
