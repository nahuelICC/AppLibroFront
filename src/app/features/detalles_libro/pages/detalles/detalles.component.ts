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
import {MatIcon} from '@angular/material/icon';
import {data} from 'autoprefixer';

@Component({
  selector: 'app-detalles',
  imports: [
    NgForOf,
    BotonComponent,
    FormsModule,
    ResenaComponent,
    DetallePrecioComponent,
    NgIf,
    MatIcon
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
  resenyas: any[] = [];
  nuevaResenya = {
    id_cliente: 1,
    id_libro: 0,
    texto: '',
    valoracion: 0
  };
  paginatedResenyas: any[] = []; // Reseñas paginadas
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 6; // Reseñas por página
  totalPages: number = 0; // Total de páginas
  displayedPages: (number | string)[] = [];
  pagesArray: number[] = [];
  tiposTapa: any[] = [];
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
        this.nuevaResenya.id_libro = this.libroId;
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
        this.calculateTotalPages();
        this.updatePaginatedResenyas();
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
      this.cdRef.detectChanges();
      return;
    }

    let total = 0;
    let count = this.resenyas.length;
    let distribution = [0, 0, 0, 0, 0];

    this.resenyas.forEach(resena => {
      total += resena.valoracion;
      distribution[resena.valoracion - 1]++;
    });

    this.averageRating = Math.round((total / count) * 10) / 10;
    this.totalReviews = count;


    this.ratingDistribution = distribution.map((count, index) => ({
      stars: index + 1,
      count: count,
      percentage: count > 0 ? parseFloat(((count / this.totalReviews) * 100).toFixed(1)) : 0
    }));

    console.log("Distribución de estrellas actualizada:", this.ratingDistribution);
    this.cdRef.detectChanges();
  }

  fetchAverageRating(): void {
    this.resenyaService.getMediaResenya(this.libroId).subscribe(
      (data) => {
        this.averageRating = data.average_rating ? parseFloat(data.average_rating.toFixed(1)) : 0;
      },
      (error) => {
        console.error('Error fetching average rating:', error);

      }
    );
  }

  submitReview() {
    this.resenyaService.addResenya(this.nuevaResenya).subscribe(
      response => {
        console.log('Reseña creada con éxito', response);
        this.fetchResenyas();
        this.nuevaResenya.texto = '';
        this.nuevaResenya.valoracion = 0;
      },
      error => {
        console.error('Error al crear la reseña', error);
      }
    );
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.resenyas.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages); // Evitar página inválida
    this.updateDisplayedPages();
  }


  updatePaginatedResenyas(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedResenyas = this.resenyas.slice(startIndex, startIndex + this.itemsPerPage);
    this.cdRef.detectChanges(); // Forzar detección de cambios
  }


  updateDisplayedPages(): void {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; // Número de páginas a mostrar alrededor de la actual

    let start = Math.max(2, current - delta);
    let end = Math.min(total - 1, current + delta);

    if (current - delta < 2) end = Math.min(total - 1, 2 + delta * 2);
    if (current + delta > total - 1) start = Math.max(2, total - 1 - delta * 2);

    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');
    if (total > 1) pages.push(total);

    this.displayedPages = pages;
  }

  setPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.updatePaginatedResenyas();
      this.updateDisplayedPages();
    }
  }


  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedResenyas();
      this.updateDisplayedPages();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedResenyas();
      this.updateDisplayedPages();
    }
  }


  onResenyaDeleted(): void {
    this.fetchResenyas();
  }


}
