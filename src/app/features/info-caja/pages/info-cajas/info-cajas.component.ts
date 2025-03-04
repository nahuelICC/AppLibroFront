import { Component, OnInit } from '@angular/core';
import { SuscripcionInicio } from '../../../inicio/DTOs/SuscripcionInicio';
import { ActivatedRoute, Router } from '@angular/router';
import { InicioService } from '../../../inicio/services/inicio.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { AlertConfirmarComponent } from '../../../../shared/components/alert-confirmar/alert-confirmar.component';
import { MatTooltip } from '@angular/material/tooltip';
import {AuthServiceService} from '../../../../core/services/auth-service.service';

/**
 * Componente que muestra la información de las cajas mistery
 */
@Component({
  selector: 'app-info-cajas',
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    MatIcon,
    BotonComponent,
    AlertConfirmarComponent,
    MatTooltip
  ],
  templateUrl: './info-cajas.component.html',
  standalone: true,
  styleUrl: './info-cajas.component.css'
})
export class InfoCajasComponent implements OnInit {
  suscripciones: SuscripcionInicio[] = [];
  suscripcionSeleccionada: SuscripcionInicio | null = null;
  mostrarAlerta: boolean = false;
  modificarSuscripcion: boolean = false;
  tipo: number = 0;
  suscrito: boolean = false;
  subscriptionType: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private inicioService: InicioService,
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idTipo = Number(params.get('id'));
      this.tipo = idTipo;
      this.modificarSuscripcion = localStorage.getItem('change') === 'true';
      this.suscrito = localStorage.getItem('isSuscribed') === 'true';
      this.subscriptionType = Number(localStorage.getItem('subscriptionType'));

      // Obtener suscripciones desde el servicio
      this.inicioService.obtenerSuscripciones().subscribe((data: SuscripcionInicio[]) => {
        this.suscripciones = data;
        this.suscripcionSeleccionada = this.suscripciones.find(s => s.id_tipo === idTipo) || null;
      });
    });
  }

  /**
   * Selecciona una suscripción
   * @param suscripcion
   */
  seleccionarSuscripcion(suscripcion: SuscripcionInicio) {
    this.suscripcionSeleccionada = suscripcion;
    this.modificarSuscripcion = this.tipo === Number(suscripcion.id_tipo);
  }

  /**
   * Muestra la alerta de confirmacion de querer suscribirse
   */
  confirmarSuscripcion() {
    this.mostrarAlerta = true;
  }

  /**
   * Confirma que los datos son correctos y redirige a la página de pago al pulsar confirmar en la alerta
   */
  onConfirm() {
    this.mostrarAlerta = false;
    if (this.suscripcionSeleccionada) {
      if (this.suscrito) {
        this.router.navigate(['/carritosuscripcion'], {
          queryParams: {
            nombre: this.suscripcionSeleccionada.nombre,
            precio: this.suscripcionSeleccionada.precio,
            tipo: this.suscripcionSeleccionada.id_tipo,
            modificar: true
          }
        });
      } else {
        this.router.navigate(['/carritosuscripcion'], {
          queryParams: {
            nombre: this.suscripcionSeleccionada.nombre,
            precio: this.suscripcionSeleccionada.precio,
            tipo: this.suscripcionSeleccionada.id_tipo
          }
        });
      }
      localStorage.removeItem('change');
    }
  }

  /**
   * Cierra la alerta si cancelas el confirmar suscripción
   */
  onCancel() {
    this.mostrarAlerta = false;
  }

  /**
   * Obtiene la descripción de una caja
   * @param descripcion
   */
  getDescripcionParts(descripcion?: string): string[] {
    if (!descripcion) {
      return [];
    }
    descripcion = descripcion.replace(/\s+/g, ' ').trim();
    return descripcion.split('.').map(part => part.trim() + '.').filter(part => part !== '.');
  }

  /**
   * Establece la etiqueta de una caja
   * @param nombre
   */
  getEtiqueta(nombre: string): string {
    const etiquetas: { [key: string]: string } = {
      'Estandar': 'Económico',
      'Plus': 'Recomendado',
      'Familiar': 'Popular'
    };
    return etiquetas[nombre] || 'Destacado';
  }

  /**
   * Comprueba si el usuario está logueado
   */
  isLogged(): boolean {
    return this.authService.isLogged();
  }

  /**
   * Comprueba si el usuario está suscrito
   */
  isSuscribed(): boolean {
    return this.suscrito;
  }

  /**
   * Obtiene el tipo de suscripción
   */
  getSubscriptionType(): number | null {
    return this.subscriptionType;
  }
}
