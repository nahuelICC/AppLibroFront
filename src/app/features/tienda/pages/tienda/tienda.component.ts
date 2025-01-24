import { Component } from '@angular/core';
import {FiltroComponent} from '../../components/filtro/filtro.component';

@Component({
  selector: 'app-tienda',
  imports: [FiltroComponent],
  templateUrl: './tienda.component.html',
  standalone: true,
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {

}
