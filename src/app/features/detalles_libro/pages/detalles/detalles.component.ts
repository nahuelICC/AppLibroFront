import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { FormsModule } from '@angular/forms';
import { ResenaComponent } from '../../components/resena/resena.component';
import { DetallePrecioComponent } from '../../components/detalle-precio/detalle-precio.component';
import { LibroDetalle } from "../../DTOs/LibroDetalle";
import { ActivatedRoute } from "@angular/router";
import { LibroServiceService } from "../../../../core/services/libro/libro-service.service";
import { LibroDetalleResponse } from '../../DTOs/LibroDetalleResponse';
import { MatIcon } from '@angular/material/icon';
import { DetallesLibroService } from '../../services/detalles-libro.service';
import { Resenya } from '../../DTOs/Resenya';
import { Paginacion } from '../../DTOs/Paginacion';
import { RatingDistribution } from '../../DTOs/RatingDistribution';

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
export class DetallesComponent implements OnInit {
  libro: LibroDetalle = new LibroDetalle('', '', '', '', '', '', '');
  resenyas: Resenya[] = [];
  nuevaResenya = new Resenya(0, 0, 0, '', 0, '', '');
  paginatedResenyas: Resenya[] = [];
  paginacion: Paginacion = new Paginacion(1, 2, 0, []);
  tiposTapa: any[] = [];
  libroId: number = 0;
  mostrarFormulario: boolean = false;
  averageRating: number = 0;
  totalReviews: number = 0;
  starsArray = [1, 2, 3, 4, 5];
  haComprado: boolean = false;
  haDejadoResenya: boolean = false;
  mostrarBoton: boolean = false;
  selectedTipoTapa: number = 0;
  clienteIdActual: number = 0;
  ratingDistribution: RatingDistribution[] = [
    new RatingDistribution(5, 0, 0),
    new RatingDistribution(4, 0, 0),
    new RatingDistribution(3, 0, 0),
    new RatingDistribution(2, 0, 0),
    new RatingDistribution(1, 0, 0)
  ];

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroServiceService,
    private detallesLibroService: DetallesLibroService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.detallesLibroService.obtenerIdCliente().subscribe(response => {
        this.clienteIdActual = response.id_cliente;
      });
      this.libroService.getLibroDetalle(+id).subscribe((data: LibroDetalleResponse) => {
        this.libro = new LibroDetalle(
          data.libro.titulo,
          data.libro.autor,
          data.libro.portada,
          data.libro.genero,
          data.libro.descripcion,
          data.libro.precioTapaBlanda,
          data.libro.precioTapaDura
        );
        this.tiposTapa = data.tiposTapa;
        this.libroId = +id;
        this.nuevaResenya.id_libro = this.libroId;

        if (this.tiposTapa && this.tiposTapa.length > 0) {
          this.selectedTipoTapa = this.tiposTapa[0];
        }

        this.fetchAverageRating();
        this.fetchResenyas();
        this.fetchTotalResenyas();
        this.verificarCompra();
      });
    }
  }

  verificarCompra(): void {
    this.detallesLibroService.obtenerIdCliente().subscribe((response) => {
      const clienteId = response.id_cliente;
      this.libroService.verificarCompra(this.libroId, clienteId).subscribe((result) => {
        this.haComprado = result.haComprado;
        this.haDejadoResenya = result.haDejadoResenya;
        this.mostrarBoton = this.haComprado && !this.haDejadoResenya;
      });
    });
  }

  fetchResenyas(): void {
    this.detallesLibroService.getResenyas(this.libroId).subscribe(
      (data) => {
        this.resenyas = data.map((resena: any) => new Resenya(
          resena.id,
          resena.id_cliente,
          resena.id_libro,
          resena.texto,
          resena.valoracion,
          resena.nombre,
          resena.apellido
        ));
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
    this.detallesLibroService.countResenyas(this.libroId).subscribe(
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
      this.ratingDistribution = this.ratingDistribution.map(entry => new RatingDistribution(entry.stars, 0, 0));
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

    this.ratingDistribution = distribution.map((count, index) => new RatingDistribution(
      index + 1,
      count,
      count > 0 ? parseFloat(((count / this.totalReviews) * 100).toFixed(1)) : 0
    ));

    this.cdRef.detectChanges();
  }

  fetchAverageRating(): void {
    this.detallesLibroService.getMediaResenya(this.libroId).subscribe(
      (data) => {
        this.averageRating = data.average_rating ? parseFloat(data.average_rating.toFixed(1)) : 0;
      },
      (error) => {
        console.error('Error fetching average rating:', error);
      }
    );
  }

  submitReview() {
    this.detallesLibroService.addResenya(this.nuevaResenya).subscribe(
      response => {
        console.log('Reseña creada con éxito', response);

        // Recargar las reseñas después de agregar una nueva reseña
        this.fetchResenyas();
        this.nuevaResenya.texto = '';  // Limpiar el formulario
        this.nuevaResenya.valoracion = 0;

        // Verificar si el cliente ha comprado el libro y dejar la reseña
        this.verificarCompra();

        // Cerrar el formulario
        this.mostrarFormulario = false;
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
    this.paginacion.totalPages = Math.ceil(this.resenyas.length / this.paginacion.itemsPerPage);
    this.paginacion.currentPage = Math.min(this.paginacion.currentPage, this.paginacion.totalPages);
    this.updateDisplayedPages();
  }

  updatePaginatedResenyas(): void {
    const startIndex = (this.paginacion.currentPage - 1) * this.paginacion.itemsPerPage;
    this.paginatedResenyas = this.resenyas.slice(startIndex, startIndex + this.paginacion.itemsPerPage);
    this.cdRef.detectChanges();
  }

  updateDisplayedPages(): void {
    const pages: (number | string)[] = [];
    const total = this.paginacion.totalPages;
    const current = this.paginacion.currentPage;
    const delta = 2;

    let start = Math.max(2, current - delta);
    let end = Math.min(total - 1, current + delta);

    if (current - delta < 2) end = Math.min(total - 1, 2 + delta * 2);
    if (current + delta > total - 1) start = Math.max(2, total - 1 - delta * 2);

    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');
    if (total > 1) pages.push(total);

    this.paginacion.displayedPages = pages;
  }

  setPage(page: number | string) {
    if (typeof page === 'number') {
      this.paginacion.currentPage = page;
      this.updatePaginatedResenyas();
      this.updateDisplayedPages();
    }
  }

  previousPage() {
    if (this.paginacion.currentPage > 1) {
      this.paginacion.currentPage--;
      this.updatePaginatedResenyas();
      this.updateDisplayedPages();
    }
  }

  nextPage() {
    if (this.paginacion.currentPage < this.paginacion.totalPages) {
      this.paginacion.currentPage++;
      this.updatePaginatedResenyas();
      this.updateDisplayedPages();
    }
  }

  onResenyaDeleted(id: number): void {
    // Eliminar la reseña
    this.resenyas = this.resenyas.filter(resena => resena.id !== id);

    // Recalcular estadísticas
    this.calcularEstadisticas();

    // Volver a calcular las páginas y la paginación
    this.calculateTotalPages();
    this.updatePaginatedResenyas();

    // Actualizar la media de las reseñas y el total
    this.fetchAverageRating();
    this.fetchTotalResenyas();

    // Verificar si el usuario puede volver a dejar una reseña
    this.verificarCompra();

    // Actualizar la vista
    this.cdRef.detectChanges();
  }


}
