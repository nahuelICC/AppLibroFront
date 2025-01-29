import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BotonComponent} from './shared/components/boton/boton.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {HeaderComponent} from './shared/components/header/header.component';
import { CuadroProductoComponent } from './features/tienda/components/cuadro-producto/cuadro-producto.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    BotonComponent,
    CuadroProductoComponent,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'AppLibro';
}
