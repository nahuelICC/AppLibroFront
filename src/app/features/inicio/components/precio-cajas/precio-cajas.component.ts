import { Component } from '@angular/core';
import { SuscripcionInicio } from '../../DTOs/SuscripcionInicio';
import { InicioService } from '../../services/inicio.service';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {NgForOf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-precio-cajas',
  imports: [
    BotonComponent,
    NgForOf,
    MatIcon
  ],
  templateUrl: './precio-cajas.component.html',
  standalone: true,
  styleUrl: './precio-cajas.component.css'
})
export class PrecioCajasComponent {
  suscripciones: SuscripcionInicio[] = [];

  constructor(private inicioService: InicioService) {}

  ngOnInit(): void {
    this.inicioService.obtenerSuscripciones().subscribe((data: SuscripcionInicio[]) => {
      this.suscripciones = data;
    });
  }

  getDescripcionParts(descripcion?: string): string[] {
    if (!descripcion) {
      return [];
    }
    // Reemplazamos los saltos de línea y normalizamos los espacios
    descripcion = descripcion.replace(/\s+/g, ' ').trim();
    // Dividimos por puntos y los dejamos al final de cada frase
    return descripcion.split('.').map(part => part.trim() + '.').filter(part => part !== '.');
  }


}
