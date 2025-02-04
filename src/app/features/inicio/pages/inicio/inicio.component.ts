import { Component } from '@angular/core';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {RouterLink} from '@angular/router';
import {MasVendidoComponent} from '../../components/mas-vendido/mas-vendido.component';
import {NovedadesComponent} from '../../components/novedades/novedades.component';
import {PrecioCajasComponent} from '../../components/precio-cajas/precio-cajas.component';

@Component({
  selector: 'app-inicio',
  imports: [
    BotonComponent,
    RouterLink,
    MasVendidoComponent,
    NovedadesComponent,
    PrecioCajasComponent
  ],
  templateUrl: './inicio.component.html',
  standalone: true,
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
