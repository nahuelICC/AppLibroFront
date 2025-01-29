import { Component } from '@angular/core';
import {RangoPrecioComponent} from '../rango-precio/rango-precio.component';

@Component({
  selector: 'app-filtro',
  imports: [
    RangoPrecioComponent
  ],
  templateUrl: './filtro.component.html',
  standalone: true,
  styleUrl: './filtro.component.css'
})
export class FiltroComponent {

}
