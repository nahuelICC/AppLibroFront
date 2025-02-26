// rango-precio.component.ts
import {Component, Output, EventEmitter, input, Input, SimpleChanges} from '@angular/core';
import {MatSlider, MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {Options} from '@angular-slider/ngx-slider';

/**
 * Componente para el rango de precios del buscador de la tienda
 */
@Component({
  selector: 'app-rango-precio',
  templateUrl: './rango-precio.component.html',
  standalone: true,
  imports: [
    MatSliderModule,
    FormsModule,
    NgxSliderModule
  ],
  styleUrls: ['./rango-precio.component.css']
})
export class RangoPrecioComponent {
  private _minValue: number = 0;
  private _maxValue: number = 100;

  /**
   * Valor mínimo del rango
   * @param val
   */
  @Input()
  set minValue(val: number) {
    this._minValue = val;
  }

  /**
   * Obtiene el valor mínimo del rango
   */
  get minValue(): number {
    return this._minValue;
  }

  /**
   * Valor máximo del rango
   * @param val
   */
  @Input()
  set maxValue(val: number) {
    this._maxValue = val;
  }

  /**
   * Obtiene el valor máximo del rango
   */
  get maxValue(): number {
    return this._maxValue;
  }
  @Output() priceChange = new EventEmitter<{ min: number; max: number }>();

  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    animate: false,
  };

  /**
   * Función para emitir el cambio de precio
   */
  onUserChangeEnd(): void {
    this.priceChange.emit({
      min: this.minValue,
      max: this.maxValue
    });
  }
}
