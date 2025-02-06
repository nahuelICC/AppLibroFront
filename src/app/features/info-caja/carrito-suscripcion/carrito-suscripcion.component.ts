import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {GeneroDTO} from '../../tienda/DTOs/GeneroDTO';
import {LibroServiceService} from '../../tienda/services/libro-service.service';
import {NgForOf} from '@angular/common';
import {NombreGeneroPipe} from '../../tienda/pipes/nombre-genero.pipe';

@Component({
  selector: 'app-carrito-suscripcion',
  imports: [
    FormsModule,
    NgForOf,
    NombreGeneroPipe
  ],
  templateUrl: './carrito-suscripcion.component.html',
  standalone: true,
  styleUrl: './carrito-suscripcion.component.css'
})
export class CarritoSuscripcionComponent implements OnInit{
  nombre: string = '';
  precio: number = 0;
  generoSeleccionado: string = '';
  generos: GeneroDTO[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private libroService: LibroServiceService) {}

  ngOnInit(): void {
    // Obtener los parámetros de la suscripción seleccionada
    this.route.queryParams.subscribe(params => {
      this.nombre = params['nombre'] || '';
      this.precio = params['precio'] || 0;
    });

    // Llamar al servicio para obtener los géneros desde la base de datos
    this.libroService.getGeneros().subscribe({
      next: (data) => {
        this.generos = data;
      },
      error: (error) => {
        console.error('Error al obtener los géneros:', error);
      }
    });
  }

  confirmarCompra() {
    if (this.generoSeleccionado) {
      // Guardar en localStorage
      localStorage.setItem('generoSeleccionado', this.generoSeleccionado);
      console.log('Género guardado:', this.generoSeleccionado);

      // Redirigir a la pasarela de pago
      this.router.navigate(['/pago']);
    }
  }

}
