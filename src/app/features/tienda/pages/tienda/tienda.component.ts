import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FiltroComponent } from '../../components/filtro/filtro.component';
import { CuadroProductoComponent } from '../../components/cuadro-producto/cuadro-producto.component';
import { CuadroProducto } from '../../DTOs/CuadroProducto';
import {LibroServiceService} from '../../services/libro-service.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {BuscadorComponent} from '../../components/buscador/buscador.component';
import {GeneroDTO} from '../../DTOs/GeneroDTO';
import {CategoriasComponent} from '../../components/categorias/categorias.component';
import {RangoPrecioComponent} from '../../components/rango-precio/rango-precio.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-tienda',
  imports: [FiltroComponent, CuadroProductoComponent, NgForOf, NgIf, MatIcon, BuscadorComponent, CategoriasComponent, RangoPrecioComponent, MatProgressSpinner, NgClass, BotonComponent],
  templateUrl: './tienda.component.html',
  standalone: true,
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit {
  libros: CuadroProducto[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  displayedPages: (number | string)[] = [];
  filters: any = {
    search: '',
    category: '',
    minPrice: null,
    maxPrice: null
  };
  minValue: number = 0;
  maxValue: number = 200;
  generos: GeneroDTO[] = [];
  allLibros: CuadroProducto[] = [];
  loading: boolean = false;
  showFilters:boolean = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  constructor(private libroService: LibroServiceService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.libroService.loading$.subscribe(loading => {
      this.loading = loading;
    });
    this.cargaLibros();
    this.cargaGenero();
  }

  cargaGenero(): void{
    this.libroService.getGeneros().subscribe({
      next: (data) => this.generos = data,
      error: (err) => console.error('Error al cargar los géneros:', err)
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargaLibros();

      // Precarga solo si la nueva página no es la última
      if (this.currentPage < this.totalPages) {
        this.libroService.getLibrosTienda(this.currentPage + 1, this.itemsPerPage, this.filters).subscribe();
      }
    }
  }

  cargaLibros(): void {
    this.libroService.getLibrosTienda(this.currentPage, this.itemsPerPage, this.filters).subscribe({
      next: (response) => {
        // Si no hay libros en la respuesta, no actualizar el listado
        if (response.libros.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          return;
        }

        this.allLibros = [...this.allLibros, ...response.libros];
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
        this.updateDisplayedPages();
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        if (this.currentPage > 1) this.currentPage--; // Retrocede si hay error
      }
    });
  }

  // Modifica los métodos que cambian los filtros
  onCategoria(numeroCategoria: number | null): void {
    this.libroService.resetCache();
    this.allLibros = []; // Limpia libros acumulados
    this.filters.category = numeroCategoria;
    this.currentPage = 1;
    this.cargaLibros();
  }

  onSearchChange(searchTerm: string): void {
    this.libroService.resetCache();
    this.allLibros = [];
    this.filters.search = searchTerm;
    this.currentPage = 1;
    this.cargaLibros();
  }

  onPriceChange(priceRange: { min: number; max: number }): void {
    this.minValue = priceRange.min;
    this.maxValue = priceRange.max;
    this.libroService.resetCache();
    this.allLibros = [];
    this.filters.minPrice = priceRange.min;
    this.filters.maxPrice = priceRange.max;
    this.currentPage = 1;
    this.cargaLibros();
  }

  // Actualiza el getter para usar allLibros


  get paginatedItems(): CuadroProducto[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.allLibros.slice(start, start + this.itemsPerPage);
  }

  setPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.cargaLibros();
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargaLibros();
    }
  }

  updateDisplayedPages() {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; // Número de páginas a mostrar alrededor de la actual

    // Calcular rango de páginas
    let start = Math.max(2, current - delta);
    let end = Math.min(total - 1, current + delta);

    // Ajustar rango si estamos cerca de los extremos
    if (current - delta < 2) end = Math.min(total - 1, 2 + delta * 2);
    if (current + delta > total - 1) start = Math.max(2, total - 1 - delta * 2);

    pages.push(1);

    // Agregar puntos suspensivos izquierdos si es necesario
    if (start > 2) pages.push('...');

    // Agregar páginas centrales
    for (let i = start; i <= end; i++) pages.push(i);

    // Agregar puntos suspensivos derechos si es necesario
    if (end < total - 1) pages.push('...');

    // Agregar última página solo si hay más de 1
    if (total > 1) pages.push(total);

    this.displayedPages = pages;
  }

  clearFilters() {
    this.libroService.resetCache();
    this.allLibros = [];
    this.filters = {
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null
    };
    this.minValue = 0;  // Reseteamos el valor mínimo
    this.maxValue = 200;
    this.cdRef.detectChanges();
    this.currentPage = 1;
    this.cargaLibros();
  }
}
