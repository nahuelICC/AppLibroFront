import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {FormsModule} from '@angular/forms';
import {ResenaComponent} from '../../components/resena/resena.component';
import {DetallePrecioComponent} from '../../components/detalle-precio/detalle-precio.component';
import {LibroDetalle} from "../../DTOs/LibroDetalle";
import {ActivatedRoute} from "@angular/router";
import {LibroServiceService} from "../../../../core/services/libro/libro-service.service";
import { LibroDetalleResponse } from '../../DTOs/LibroDetalleResponse';
import {LibroTipoService} from '../../services/libro-tipo.service';
import { ResenyaService } from '../../services/resenya.service';

@Component({
  selector: 'app-detalles',
  imports: [
    NgForOf,
    BotonComponent,
    FormsModule,
    ResenaComponent,
    DetallePrecioComponent,
    NgIf
  ],
  templateUrl: './detalles.component.html',
  standalone: true,
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements OnInit{
  libro: any = {
    precioTapaBlanda: null,
    precioTapaDura: null
  };
  cantidad: number = 1;
  precioTotal: number = 0;
  resenyas: any[] = [];
  nuevaResenya: { texto: string; valoracion: number } = { texto: '', valoracion: 0 };
  tiposTapa: any[] = [];
  tipoTapa: string = 'Tapa dura';
  libroId: number = 0;
  mostrarFormulario: boolean = false;
  averageRating: number = 0;
  totalReviews: number = 0;
  starsArray = [1, 2, 3, 4, 5];

  ratingDistribution = [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ];


  constructor(
      private route: ActivatedRoute,
      private libroService: LibroServiceService,
      private libroTipoService: LibroTipoService,
      private resenyaService: ResenyaService,
      private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.libroService.getLibroDetalle(+id).subscribe((data: LibroDetalleResponse) => {
        this.libro = data.libro;
        this.tiposTapa = data.tiposTapa;
        this.libroId = +id;
        // this.actualizarPrecioTotal();
        this.fetchAverageRating();
        this.fetchResenyas();
        this.fetchTotalResenyas();
      });
    }
  }

  fetchResenyas(): void {
    this.resenyaService.getResenyas(this.libroId).subscribe(
      (data) => {
        this.resenyas = data;
        this.calcularEstadisticas();
      },
      (error) => {
        console.error('Error fetching resenyas:', error);
      }
    );
  }

  fetchTotalResenyas(): void {
    this.resenyaService.countResenyas(this.libroId).subscribe(
      (data) => {
        this.totalReviews = data.total_resenyas;
      },
      (error) => {
        console.error('Error fetching total resenyas:', error);
      }
    );
  }

  calcularEstadisticas() {
    if (!this.resenyas || this.resenyas.length === 0) {
      this.ratingDistribution = this.ratingDistribution.map(entry => ({ ...entry, count: 0, percentage: 0 }));
      this.cdRef.detectChanges(); // Forzamos la detección de cambios en Angular
      return;
    }

    let total = 0;
    let count = this.resenyas.length;
    let distribution = [0, 0, 0, 0, 0]; // Distribución de 1 a 5 estrellas

    // Contamos cuántas reseñas hay para cada valoración
    this.resenyas.forEach(resena => {
      total += resena.valoracion;  // Sumamos la valoración para el promedio
      distribution[resena.valoracion - 1]++; // Corrección del índice, para que el valor 1 esté en el índice 0
    });

    // Calculamos el promedio de valoraciones
    this.averageRating = parseFloat((total / count).toFixed(1));
    this.totalReviews = count;

    // Ahora calculamos el porcentaje de cada valor en base a la distribución
    this.ratingDistribution = distribution.map((count, index) => ({
      stars: index + 1,  // Las estrellas son 1, 2, 3, 4, 5
      count: count,
      percentage: count > 0 ? parseFloat(((count / this.totalReviews) * 100).toFixed(1)) : 0  // Calculamos el porcentaje correctamente
    }));

    console.log("Distribución de estrellas actualizada:", this.ratingDistribution);
    this.cdRef.detectChanges(); // Forzamos actualización de Angular
  }






  fetchAverageRating(): void {
    this.resenyaService.getMediaResenya(this.libroId).subscribe(
      (data) => {
        this.averageRating = data.average_rating || 0;
      },
      (error) => {
        console.error('Error fetching average rating:', error);
        this.averageRating = 0; // Set to 0 in case of error
      }
    );
  }

  // actualizarPrecioTotal(): void {
  //   this.libroTipoService.updatePrecio(this.cantidad, this.tipoTapa).subscribe((data) => {
  //     this.precioTotal = data.nuevoPrecio;
  //   });
  // }
  //
  // onCantidadChange(): void {
  //   this.actualizarPrecioTotal();
  // }
  //
  // onTipoTapaChange(tipoTapa: string): void {
  //   this.tipoTapa = tipoTapa;
  //   this.actualizarPrecioTotal();
  // }

  submitReview() {

  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}
