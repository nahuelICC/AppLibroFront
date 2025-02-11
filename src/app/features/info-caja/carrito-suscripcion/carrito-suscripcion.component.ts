import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {GeneroDTO} from '../../tienda/DTOs/GeneroDTO';
import {LibroServiceService} from '../../tienda/services/libro-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {NombreGeneroPipe} from '../../tienda/pipes/nombre-genero.pipe';
import {BotonComponent} from '../../../shared/components/boton/boton.component';
import {PerfilUsuarioService} from '../../usuario/services/perfil-usuario.service';
import {AlertConfirmarComponent} from '../../../shared/components/alert-confirmar/alert-confirmar.component';

@Component({
  selector: 'app-carrito-suscripcion',
  imports: [
    FormsModule,
    NgForOf,
    NombreGeneroPipe,
    NgIf,
    BotonComponent,
    AlertConfirmarComponent
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
  tipoSuscripcion: string = '';
  idTipo: number | null = null;
  menuAbierto: boolean = false;
  editarGenero: boolean = false;
  mostrarAlerta: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private libroService: LibroServiceService, private perfilUsuarioService: PerfilUsuarioService) {}

  ngOnInit(): void {
    // Obtener los parámetros de la suscripción seleccionada
    this.route.queryParams.subscribe(params => {
      this.nombre = params['nombre'] || '';
      this.precio = params['precio'] || 0;
      this.idTipo = Number(params['tipo']);
      this.editarGenero = params['modificar'] === 'true';
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
    console.log('Valores antes de guardar en localStorage:', this.generoSeleccionado, this.tipoSuscripcion, this.idTipo);
    if (!this.editarGenero){
      if (this.generoSeleccionado && this.idTipo !== null && this.idTipo !== undefined) {
        localStorage.setItem('generoSeleccionado', this.generoSeleccionado); // Género seleccionado
        localStorage.setItem('idTipoSuscripcion', this.idTipo.toString()); // idTipo de suscripción
        localStorage.setItem('esSuscripcion', 'true'); // Indicamos que es una suscripción

        console.log('Generos, Precio, y Tipo de Suscripción en localStorage:');
        console.log('generoSeleccionado:', localStorage.getItem('generoSeleccionado'));
        console.log('idTipoSuscripcion:', localStorage.getItem('idTipoSuscripcion'));
        console.log('esSuscripcion:', localStorage.getItem('esSuscripcion'));

        this.router.navigate(['/pago']);
      } else {
        console.error('Faltan datos de suscripción.');
      }
    }else {
      this.perfilUsuarioService.putEditarTipoSuscripcion(this.idTipo, Number(this.generoSeleccionado)).subscribe({
          next: (data) => {
            console.log('Respuesta del servidor:', data);
            this.router.navigate(['/usuario']);
          },
          error: (error) => {
            console.error('Error al editar el tipo de suscripción:', error);
          }
        }
      );
    }


  }
  seleccionarGenero(genero: number) {
    this.generoSeleccionado = genero.toString();
    this.menuAbierto = false; // Cierra el menú después de seleccionar
  }

  getGeneroText(): string {
    const genero = this.generos.find(g => g.numero.toString() === this.generoSeleccionado);
    return genero ? genero.nombre : '';
  }


}
