import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BotonComponent} from './shared/components/boton/boton.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {CuadroProductoComponent} from './features/tienda/components/cuadro-producto/cuadro-producto.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, BotonComponent, CuadroProductoComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AppLibro';
}
