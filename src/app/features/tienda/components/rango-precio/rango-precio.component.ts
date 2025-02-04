// rango-precio.component.ts
import {Component, Output, EventEmitter, input, Input, SimpleChanges} from '@angular/core';
import {MatSlider, MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {Options} from '@angular-slider/ngx-slider';


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

  @Input()
  set minValue(val: number) {
    this._minValue = val;
    // Si es necesario, puedes agregar lógica para reiniciar el slider aquí
    // Por ejemplo, actualizar alguna variable interna o llamar a una función de reinicialización
  }
  get minValue(): number {
    return this._minValue;
  }

  @Input()
  set maxValue(val: number) {
    this._maxValue = val;
    // Lógica similar para maxValue
  }
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

  onUserChangeEnd(): void {
    this.priceChange.emit({
      min: this.minValue,
      max: this.maxValue
    });
  }
}
