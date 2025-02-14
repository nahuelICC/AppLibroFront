import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { NotificacionesDTO } from '../../DTOs/NotificacionesDTO';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notificaciones',
  imports: [
    NgIf,
    NgForOf,
    DatePipe
  ],
  templateUrl: './notificaciones.component.html',
  standalone: true,
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit {
  notificacionesNoLeidas: NotificacionesDTO[] = [];
  notificacionesLeidas: NotificacionesDTO[] = [];
  cargando = true;
  error = '';
  idUsuario!: number;

  constructor(private notificacionesService: NotificacionesService,
              private dialogRef: MatDialogRef<NotificacionesComponent>) {}

  ngOnInit() {
    this.notificacionesService.obtenerIdUsuario().subscribe({
      next: (data) => {
        this.idUsuario = data.id_usuario;
        this.cargarNotificaciones(this.idUsuario);
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al obtener el ID del usuario.';
      }
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.marcarNotificacionesComoLeidas();
    });
  }

  cargarNotificaciones(id_usuario: number) {
    this.notificacionesService.getNotificacionesDeUsuario(id_usuario).subscribe({
      next: (notifs: NotificacionesDTO[]) => {
        // Ajustar la hora restando 1 hora
        notifs.forEach(notif => {
          let fecha = notif.fecha ? new Date(notif.fecha) : new Date();
          fecha.setHours(fecha.getHours() - 1); // Restar 1 hora
          notif.fecha = fecha;
        });

        this.notificacionesNoLeidas = notifs.filter(n => !n.leida);
        this.notificacionesLeidas = notifs.filter(n => n.leida).slice(-2); // Solo las últimas 2
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al cargar las notificaciones.';
      }
    });
  }


  marcarNotificacionesComoLeidas() {
    if (this.notificacionesNoLeidas.length > 0) {
      this.notificacionesService.marcarTodasComoLeidas(this.idUsuario).subscribe({
        next: () => {
          // Agregar las notificaciones no leídas a las leídas
          this.notificacionesLeidas = [
            ...this.notificacionesLeidas,
            ...this.notificacionesNoLeidas
          ].slice(-2); // Solo mantener las últimas 2

          // Limpiar las no leídas
          this.notificacionesNoLeidas = [];
        },
        error: () => {
          console.error('Error al marcar las notificaciones como leídas');
        }
      });
    }
  }


  cerrarDialogo() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.marcarNotificacionesComoLeidas();
  }
}
