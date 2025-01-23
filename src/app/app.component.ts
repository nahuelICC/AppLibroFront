import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BotonComponent} from './shared/components/boton/boton.component';
import {FooterComponent} from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, BotonComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AppLibro';
}
