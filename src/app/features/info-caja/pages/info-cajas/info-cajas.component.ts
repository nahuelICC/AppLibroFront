import {Component, OnInit} from '@angular/core';
import {SuscripcionInicio} from '../../../inicio/DTOs/SuscripcionInicio';
import {ActivatedRoute, Router} from '@angular/router';
import {InicioService} from '../../../inicio/services/inicio.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {AlertConfirmarComponent} from '../../../../shared/components/alert-confirmar/alert-confirmar.component';

@Component({
  selector: 'app-info-cajas',
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    MatIcon,
    BotonComponent,
    AlertConfirmarComponent
  ],
  templateUrl: './info-cajas.component.html',
  standalone: true,
  styleUrl: './info-cajas.component.css'
})
export class InfoCajasComponent implements OnInit{
  suscripciones: SuscripcionInicio[] = [];
  suscripcionSeleccionada: SuscripcionInicio | null = null;
  mostrarAlerta: boolean = false;

  constructor(private route: ActivatedRoute, private inicioService: InicioService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idTipo = Number(params.get('id'));

      // Obtener suscripciones desde el servicio
      this.inicioService.obtenerSuscripciones().subscribe((data: SuscripcionInicio[]) => {
        this.suscripciones = data;
        this.suscripcionSeleccionada = this.suscripciones.find(s => s.id_tipo === idTipo) || null;
      });
    });
  }

  seleccionarSuscripcion(suscripcion: SuscripcionInicio) {
    this.suscripcionSeleccionada = suscripcion;
  }
  confirmarSuscripcion() {
    this.mostrarAlerta = true;
  }

  onConfirm() {
    this.mostrarAlerta = false;
    if (this.suscripcionSeleccionada) {
      this.router.navigate(['/carritosuscripcion'], {
        queryParams: {
          nombre: this.suscripcionSeleccionada.nombre,
          precio: this.suscripcionSeleccionada.precio
        }
      });
    }
  }

  onCancel() {
    this.mostrarAlerta = false;
  }

  getDescripcionParts(descripcion?: string): string[] {
    if (!descripcion) {
      return [];
    }
    descripcion = descripcion.replace(/\s+/g, ' ').trim();
    return descripcion.split('.').map(part => part.trim() + '.').filter(part => part !== '.');
  }

  getEtiqueta(nombre: string): string {
    const etiquetas: { [key: string]: string } = {
      'Estandar': 'Económico',
      'Plus': 'Recomendado',
      'Familiar': 'Popular'
    };
    return etiquetas[nombre] || 'Destacado';
  }

}
