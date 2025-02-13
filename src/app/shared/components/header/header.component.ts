// src/app/shared/components/header/header.component.ts
import {Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';
import { NgIf } from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatBadge} from '@angular/material/badge';
import {CarritoService} from '../../../features/carrito/services/carrito.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf,
    MatIcon,
    MatBadge
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  mobileMenuOpen = false;
  constructor(public authService: AuthServiceService,private carritoService: CarritoService) {}

  cantidadCarrito = 0;
  private cartSubscription!: Subscription;
  cantidadNotificaciones = 3; // Cambiar dinámicamente con datos del backend


  ngOnInit(): void {
    // Suscribirse al contador del carrito
    this.cartSubscription = this.carritoService.cartItemCount$.subscribe((count) => {
      this.cantidadCarrito = count;
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción al destruir el componente
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    // Redirect to main page after logout
    window.location.href = '/main';
  }

  get isAuthenticated(): boolean {
    return this.authService.isLogged();
  }
}
