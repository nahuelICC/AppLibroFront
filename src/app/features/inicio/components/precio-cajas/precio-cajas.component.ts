

import {Component, OnInit} from '@angular/core';
import { SuscripcionInicio } from '../../DTOs/SuscripcionInicio';
import { InicioService } from '../../services/inicio.service';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {NgForOf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

/**
 * Componente que muestra la información de las cajas mistery
 */
@Component({
  selector: 'app-precio-cajas',
  imports: [
    BotonComponent,
    NgForOf,
    MatIcon,
    RouterLink
  ],
  templateUrl: './precio-cajas.component.html',
  standalone: true,
  styleUrl: './precio-cajas.component.css'
})
export class PrecioCajasComponent implements OnInit{
  suscripciones: SuscripcionInicio[] = [];

  constructor(private inicioService: InicioService) {}

  ngOnInit(): void {
    this.inicioService.obtenerSuscripciones().subscribe((data: SuscripcionInicio[]) => {
      this.suscripciones = data;
    });
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
   * Obtiene la etiqueta de una caja
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



}
