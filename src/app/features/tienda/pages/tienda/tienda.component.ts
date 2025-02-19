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
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-tienda',
  imports: [FiltroComponent, CuadroProductoComponent, NgForOf, NgIf, MatIcon, BuscadorComponent, CategoriasComponent, RangoPrecioComponent, MatProgressSpinner, NgClass, BotonComponent, RouterLink],
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
  maxValue: number = 100;
  generos: GeneroDTO[] = [];
  allLibros: CuadroProducto[] = [];
  loadedPages: Map<number, CuadroProducto[]> = new Map<number, CuadroProducto[]>();
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

  cargaLibros(page?: number): void {
    const pageToLoad = page ?? this.currentPage;

    if (this.loadedPages.has(pageToLoad)) {
      this.currentPage = pageToLoad;
      this.updateDisplayedPages();
      return;
    }

    this.libroService.getLibrosTienda(pageToLoad, this.itemsPerPage, this.filters).subscribe({
      next: (response) => {
        if (response.libros.length === 0 && pageToLoad > 1) {
          this.currentPage--;
          return;
        }

        // Almacenar la página cargada
        this.loadedPages.set(pageToLoad, response.libros);
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);

        if (!page) {
          this.currentPage = pageToLoad;
        }
        this.updateDisplayedPages();

        // Precargar páginas adyacentes
        this.preloadAdjacentPages(pageToLoad);
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        if (pageToLoad > 1) this.currentPage--;
      }
    });
  }

// Nuevo método para precarga
  private preloadAdjacentPages(currentPage: number): void {
    const pagesToPreload = [currentPage - 1, currentPage + 1];
    pagesToPreload.forEach(page => {
      if (page > 0 && page <= this.totalPages && !this.loadedPages.has(page)) {
        this.libroService.getLibrosTienda(page, this.itemsPerPage, this.filters).subscribe();
      }
    });
  }

  // Modifica los métodos que cambian los filtros
  onCategoria(numeroCategoria: number | null): void {
    this.libroService.resetCache();
    this.loadedPages.clear(); // Limpiar páginas cargadas
    this.filters.category = numeroCategoria;
    this.currentPage = 1;
    this.cargaLibros();
  }

  onSearchChange(searchTerm: string): void {
    this.libroService.resetCache();
    this.loadedPages.clear();
    this.filters.search = searchTerm;
    this.currentPage = 1;
    this.cargaLibros();
  }

  onPriceChange(priceRange: { min: number; max: number }): void {
    this.minValue = priceRange.min;
    this.maxValue = priceRange.max;
    this.libroService.resetCache();
    this.loadedPages.clear();
    this.filters.minPrice = priceRange.min;
    this.filters.maxPrice = priceRange.max;
    this.currentPage = 1;
    this.cargaLibros();
  }

  // Actualiza el getter para usar allLibros


  get paginatedItems(): CuadroProducto[] {
    return this.loadedPages.get(this.currentPage) || [];
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
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    // Casos especiales
    if (total <= 0) {
      this.displayedPages = [];
      return;
    }
    if (total === 1) {
      this.displayedPages = [1];
      return;
    }
    if (total <= maxVisible) {
      this.displayedPages = Array.from({length: total}, (_, i) => i + 1);
      return;
    }

    // Siempre mostrar primera y última página
    pages.push(1);

    // Lógica para páginas intermedias
    const calculateMiddle = () => {
      if (current <= 3) {
        // Primeras 3 páginas: [1, 2, 3, 4, 5, ..., total]
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push('...');
      } else if (current >= total - 2) {
        // Últimas 3 páginas: [1, ..., total-3, total-2, total-1, total]
        pages.push('...');
        for (let i = total - 4; i < total; i++) pages.push(i);
      } else {
        // Páginas intermedias: [1, ..., current-1, current, current+1, ..., total]
        pages.push('...');
        pages.push(current - 1, current, current + 1);
        pages.push('...');
      }
    };

    calculateMiddle();
    pages.push(total);

    // Limpiar y ajustar
    this.displayedPages = pages.filter((page, index, arr) => {
      // Eliminar puntos suspensivos consecutivos
      if (page === '...' && arr[index - 1] === '...') return false;
      // Eliminar números mayores al total
      if (typeof page === 'number' && page > total) return false;
      return true;
    }).slice(0, maxVisible);
  }

  clearFilters() {
    this.libroService.resetCache();
    this.loadedPages.clear();
    this.filters = {
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null
    };
    this.minValue = 0;  // Reseteamos el valor mínimo
    this.maxValue = 100;
    this.cdRef.detectChanges();
    this.currentPage = 1;
    this.cargaLibros();
  }
}
