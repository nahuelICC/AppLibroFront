import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { FormsModule } from '@angular/forms';
import { ResenaComponent } from '../../components/resena/resena.component';
import { DetallePrecioComponent } from '../../components/detalle-precio/detalle-precio.component';
import { ActivatedRoute } from "@angular/router";
import { LibroServiceService } from "../../../../core/services/libro/libro-service.service";
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
  libro: any ;
  resenyas: Resenya[] = [];
  nuevaResenya = new Resenya(0, 0, 0, '', 0, '', '');
  paginatedResenyas: Resenya[] = [];
  paginacion: Paginacion = new Paginacion(1, 2, 0, []);
  libroId: number = 0;
  mostrarFormulario: boolean = false;
  averageRating: number = 0; // Inicializado en 0
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
      this.libroService.getLibroDetalle(+id).subscribe((data: any) => {
        this.libro = data;
        this.libroId = +id;
        this.nuevaResenya.id_libro = this.libroId;

        if (this.libro.tiposTapa && this.libro.tiposTapa.length > 0) {
          this.selectedTipoTapa = this.libro.tiposTapa[0];
        }

        // Obtener el promedio de las reseñas desde la base de datos
        this.fetchAverageRating();

        // Obtener las reseñas individuales
        this.fetchResenyas();

        // Verificar compra
        this.verificarCompra();
      });
    }
  }

  verificarCompra(): void {
    this.libroService.verificarCompra(this.libroId, this.clienteIdActual).subscribe((result) => {
      this.haComprado = result.haComprado; // Verifica si el cliente ha comprado el libro
      this.haDejadoResenya = result.haDejadoResenya; // Verifica si el cliente ya ha dejado una reseña
      this.mostrarBoton = this.haComprado && !this.haDejadoResenya; // Muestra el botón solo si ha comprado y no ha dejado reseña

      console.log('Verificar compra:', {
        haComprado: this.haComprado,
        haDejadoResenya: this.haDejadoResenya,
        mostrarBoton: this.mostrarBoton
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

        // Calcular las estadísticas de distribución de valoraciones
        this.calcularEstadisticas();

        // Actualizar la paginación
        this.calculateTotalPages();
        this.updatePaginatedResenyas();

        // Forzar la actualización de la vista
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error fetching resenyas:', error);
      }
    );
  }

  calcularEstadisticas() {
    if (!this.resenyas || this.resenyas.length === 0) {
      this.ratingDistribution = this.ratingDistribution.map(entry => new RatingDistribution(entry.stars!, 0, 0));
      this.totalReviews = 0;
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
        if (data.average_rating) {
          this.averageRating = parseFloat(parseFloat(data.average_rating.toString()).toFixed(1));
        } else {
          this.averageRating = 0;
        }
        console.log('Average Rating from DB:', this.averageRating);

        // Forzar la actualización de la vista
        this.cdRef.detectChanges();
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

        // Recargar las reseñas y el promedio
        this.fetchResenyas();
        this.fetchAverageRating();

        // Limpiar el formulario de la nueva reseña
        this.nuevaResenya.texto = '';
        this.nuevaResenya.valoracion = 0;

        // Verificar si el cliente ha comprado el libro y dejado la reseña
        this.verificarCompra();

        // Cerrar el formulario
        this.mostrarFormulario = false;

        // Forzar la actualización de la vista
        this.cdRef.detectChanges();
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
    if (!this.resenyas || this.resenyas.length === 0) {
      this.paginacion.totalPages = 0;
      this.paginacion.currentPage = 1;
      this.paginatedResenyas = [];
      this.updateDisplayedPages();
      return;
    }

    // Calcula el número total de páginas
    this.paginacion.totalPages = Math.ceil(this.resenyas.length / this.paginacion.itemsPerPage);

    // Ajusta la página actual si excede el número total de páginas
    this.paginacion.currentPage = Math.min(this.paginacion.currentPage, this.paginacion.totalPages);

    // Actualiza las reseñas paginadas y los números de página visibles
    this.updatePaginatedResenyas();
    this.updateDisplayedPages();
  }

  updatePaginatedResenyas(): void {
    if (!this.resenyas || this.resenyas.length === 0) {
      this.paginatedResenyas = [];
      return;
    }

    const startIndex = (this.paginacion.currentPage - 1) * this.paginacion.itemsPerPage;
    this.paginatedResenyas = this.resenyas.slice(startIndex, startIndex + this.paginacion.itemsPerPage);
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
    // Eliminar la reseña localmente
    this.resenyas = this.resenyas.filter(resena => resena.id !== id);

    // Recargar el promedio de las reseñas
    this.fetchAverageRating();

    // Recalcular las estadísticas de distribución de valoraciones
    this.calcularEstadisticas();

    // Actualizar la paginación
    this.calculateTotalPages();
    this.updatePaginatedResenyas();
    this.verificarCompra();

    // Forzar la actualización de la vista
    this.cdRef.detectChanges();
  }
}
