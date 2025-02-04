// rango-precio.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
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
  minValue: number = 0;
  maxValue: number = 100;
  @Output() priceChange = new EventEmitter<{ min: number; max: number }>();
  currentMinValue: number = this.minValue;
  currentMaxValue: number = this.maxValue;

  options: Options = {
    floor: 0,
    ceil: 250,
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
