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

  private generateCacheKey(page: number, filters: any): string {
    const sortedFilters = filters ?
      Object.keys(filters).sort().reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {})
      : {};
    return `${page}_${JSON.stringify(sortedFilters)}`;
  }

  constructor(private http: HttpClient) {}

  getLibrosTienda(page: number, itemsPerPage: number, filters?: any): Observable<{ libros: CuadroProducto[], total: number }> {
    this.loadingSubject.next(true); // Inicia carga

    const key = this.generateCacheKey(page, filters);

    if (this.cache.has(key)) {
      this.loadingSubject.next(false); // Si está en caché, no hay carga
      return of(this.cache.get(key)!);
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', itemsPerPage.toString());

    if (filters) {
      Object.keys(filters).forEach(k => {
        if (filters[k] !== null && filters[k] !== undefined) {
          params = params.set(k, filters[k].toString());
        }
      });
    }

    return this.http.get<{ libros: CuadroProducto[], total: number }>(`${this.apiUrl}/librosTienda`, { params }).pipe(
      tap({
        next: (response) => {
          const totalPages = Math.ceil(response.total / itemsPerPage);
          this.cache.set(key, response);

          // Precarga silenciosa (sin activar el loading)
          if (page < 3 && page < totalPages) { // Precarga solo primeras 3 páginas
            const nextPageKey = this.generateCacheKey(page + 1, filters);
            if (!this.cache.has(nextPageKey)) {
              this.getLibrosTienda(page + 1, itemsPerPage, filters).subscribe();
            }
          }
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false),
        finalize: () => this.loadingSubject.next(false)
      })
    );
  }

  resetCache(): void {
    this.cache.clear();
  }

  getGeneros(): Observable<GeneroDTO[]> {
    return this.http.get<GeneroDTO[]>(`${this.apiUrl}/generos`);
  }
}
