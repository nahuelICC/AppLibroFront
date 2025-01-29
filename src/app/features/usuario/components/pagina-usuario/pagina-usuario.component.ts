import { Component } from '@angular/core';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-pagina-usuario',
  imports: [
    BotonComponent
  ],
  templateUrl: './pagina-usuario.component.html',
  standalone: true,
  styleUrl: './pagina-usuario.component.css'
})
export class PaginaUsuarioComponent {

}
