// src/app/shared/components/header/header.component.ts
import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';
import {NgClass, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatBadge} from '@angular/material/badge';
import {CarritoService} from '../../../features/carrito/services/carrito.service';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificacionesComponent} from '../notificaciones/notificaciones.component';
import {NotificacionesService} from '../../services/notificaciones.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf,
    MatIcon,
    MatBadge,
    NgClass
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  mobileMenuOpen = false;
  constructor(public authService: AuthServiceService,private carritoService: CarritoService, private notificacionesService: NotificacionesService, public dialog: MatDialog) {}

  cantidadCarrito = 0;
  private cartSubscription!: Subscription;
  cantidadNotificaciones = 0;
  private notificationsSubscription!: Subscription;
  notificationsDialogRef: MatDialogRef<NotificacionesComponent> | null = null;// Cambiar dinámicamente con datos del backend
  admin: boolean = false;


  ngOnInit(): void {
    // Suscribirse al contador del carrito
    this.cartSubscription = this.carritoService.cartItemCount$.subscribe((count) => {
      this.cantidadCarrito = count;
    });

    // Obtener el número de notificaciones no leídas
    this.actualizarCantidadNotificaciones();
  }

  actualizarCantidadNotificaciones(): void {
    if (!this.isAuthenticated) {
      this.cantidadNotificaciones = 0; // Si no está autenticado, no hay notificaciones
      return;
    }

    this.notificationsSubscription = this.notificacionesService.obtenerIdUsuario().subscribe({
      next: (data) => {
        const userId = data.id_usuario;
        this.notificacionesService.getNotificacionesDeUsuario(userId).subscribe((notificaciones) => {
          this.cantidadNotificaciones = notificaciones.filter((notificacion) => !notificacion.leida).length;
        });
      },
      error: (error) => {
        console.error('Error al obtener ID del usuario:', error);
        this.cantidadNotificaciones = 0; // Si hay error, no mostrar notificaciones
      }
    });
  }


  openNotifications(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    // Cierra el diálogo si ya está abierto
    if (this.notificationsDialogRef) {
      this.notificationsDialogRef.close();
      this.notificationsDialogRef = null;
      return;
    }

    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    let dialogPosition = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left - 150}px`
    };

    if (screenWidth < 600) {
      dialogPosition = {
        top: `${rect.bottom + 10}px`,
        left: `10px`
      };
    }

    this.notificationsDialogRef = this.dialog.open(NotificacionesComponent, {
      width: screenWidth < 600 ? '90vw' : '350px',
      position: dialogPosition,
      hasBackdrop: false,
      panelClass: 'custom-dialog-container'
    });

    // Limpiar referencia cuando se cierra el diálogo
    this.notificationsDialogRef.afterClosed().subscribe(() => {
      this.notificationsDialogRef = null;
      this.actualizarCantidadNotificaciones(); // Llamar a la función de actualización
    });
  }



  ngOnDestroy(): void {
    // Limpiar las suscripciones al destruir el componente
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
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
