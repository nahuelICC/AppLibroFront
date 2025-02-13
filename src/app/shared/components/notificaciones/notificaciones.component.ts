import {Component, OnInit} from '@angular/core';
import {NotificacionesService} from '../../services/notificaciones.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './notificaciones.component.html',
  standalone: true,
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit {
  notificaciones: any[] = [];
  cargando = true;
  error = '';

  constructor(private notificacionesService: NotificacionesService) {}

  ngOnInit() {
    // Obtener el ID del cliente y luego sus notificaciones
    this.notificacionesService.obtenerIdCliente().subscribe({
      next: (data) => {
        const idCliente = data.id_cliente;
        this.cargarNotificaciones(idCliente);
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al obtener el ID del cliente.';
      }
    });
  }

  cargarNotificaciones(id_cliente: number) {
    this.notificacionesService.getNotificacionesDeCliente(id_cliente).subscribe({
      next: (notifs) => {
        this.notificaciones = notifs;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al cargar las notificaciones.';
      }
    });
  }
}
