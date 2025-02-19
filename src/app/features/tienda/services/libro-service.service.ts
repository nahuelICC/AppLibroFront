import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap, BehaviorSubject } from 'rxjs';
import { CuadroProducto } from '../DTOs/CuadroProducto';
import { GeneroDTO } from '../DTOs/GeneroDTO';

@Injectable({
  providedIn: 'root',
})
export class LibroServiceService {
  private apiUrl = 'http://localhost:8000/api/libros';
  private cache = new Map<string, { libros: CuadroProducto[], total: number }>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private generateCacheKey(page: number, filters: any): string {
    const sortedFilters = filters ?
      Object.keys(filters).sort().reduce((acc, key) => ({
        ...acc,
        [key]: filters[key]?.toString().toLowerCase()
      }), {})
      : {};
    return `${page}_${JSON.stringify(sortedFilters)}`;
  }

  getLibrosTienda(
    page: number,
    itemsPerPage: number,
    filters?: any
  ): Observable<{ libros: CuadroProducto[], total: number }> {
    this.loadingSubject.next(true);
    const key = this.generateCacheKey(page, filters);

    // Verificar caché primero
    if (this.cache.has(key)) {
      setTimeout(() => this.loadingSubject.next(false), 50); // Pequeño delay para consistencia UI
      return of(this.cache.get(key)!);
    }

    // Configurar parámetros de la solicitud
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', itemsPerPage.toString());

    if (filters) {
      Object.keys(filters).forEach(k => {
        const value = filters[k];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(k, value.toString());
        }
      });
    }

    // Realizar la solicitud HTTP
    return this.http.get<{ libros: CuadroProducto[], total: number }>(
      `${this.apiUrl}/librosTienda`,
      { params }
    ).pipe(
      tap({
        next: (response) => {
          this.handleSuccessfulResponse(page, itemsPerPage, filters, response, key);
        },
        error: () => this.loadingSubject.next(false),
        finalize: () => this.loadingSubject.next(false)
      })
    );
  }

  private handleSuccessfulResponse(
    currentPage: number,
    itemsPerPage: number,
    filters: any,
    response: { libros: CuadroProducto[], total: number },
    cacheKey: string
  ): void {
    // Almacenar en caché
    this.cache.set(cacheKey, response);

    // Calcular páginas totales
    const totalPages = Math.ceil(response.total / itemsPerPage);

    // Precargar páginas relacionadas
    this.autoPreloadPages(currentPage, itemsPerPage, filters, totalPages);
  }

  private autoPreloadPages(
    currentPage: number,
    itemsPerPage: number,
    filters: any,
    totalPages: number
  ): void {
    const pagesToPreload = [];

    // Estrategia de precarga diferente para la primera página
    if (currentPage === 1) {
      for (let i = 2; i <= Math.min(3, totalPages); i++) {
        pagesToPreload.push(i);
      }
    } else {
      // Precargar páginas adyacentes
      pagesToPreload.push(currentPage - 1, currentPage + 1);
    }

    // Precargar páginas necesarias
    pagesToPreload.forEach(page => {
      if (page > 0 && page <= totalPages) {
        const pageKey = this.generateCacheKey(page, filters);
        if (!this.cache.has(pageKey)) {
          this.getLibrosTienda(page, itemsPerPage, filters).subscribe();
        }
      }
    });
  }

  resetCache(): void {
    this.cache.clear();
  }

  getGeneros(): Observable<GeneroDTO[]> {
    return this.http.get<GeneroDTO[]>(`${this.apiUrl}/generos`);
  }
}
