import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-rango-precio',
  imports: [FormsModule, NgStyle],
  templateUrl: './rango-precio.component.html',
  standalone: true,
  styleUrl: './rango-precio.component.css',
})
export class RangoPrecioComponent {
  // Valores límite del rango
  min: number = 10;
  max: number = 50;

  // Valores seleccionados
  selectedMin: number = 15;
  selectedMax: number = 45;

  // Método llamado al mover el slider mínimo
  onMinInput(): void {
    if (this.selectedMin >= this.selectedMax - 1) {
      // Evitar colisión
      this.selectedMin = this.selectedMax - 1;
    }
  }

  // Método llamado al mover el slider máximo
  onMaxInput(): void {
    if (this.selectedMax <= this.selectedMin + 1) {
      // Evitar colisión
      this.selectedMax = this.selectedMin + 1;
    }
  }
}
