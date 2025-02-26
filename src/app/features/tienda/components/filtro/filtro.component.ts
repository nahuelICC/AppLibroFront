import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RangoPrecioComponent} from '../rango-precio/rango-precio.component';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CategoriasComponent} from '../categorias/categorias.component';
import {BuscadorComponent} from '../buscador/buscador.component';

/**
 * Componente para el filtro de la tienda
 */
@Component({
  selector: 'app-filtro',
  imports: [
    RangoPrecioComponent,
    FormsModule,
    CategoriasComponent,
    BuscadorComponent
  ],
  templateUrl: './filtro.component.html',
  standalone: true,
  styleUrl: './filtro.component.css'
})
export class FiltroComponent implements OnInit{
  @Output() filtersChanged = new EventEmitter<any>();
  searchText: string = '';
  private searchSubject = new Subject<string>();
  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.onSearch(query));
  }

  /**
   * Función para buscar
   * @param query
   */
  onSearchInput(query: string): void {
    this.searchSubject.next(query);
  }

  /**
   * Función para filtrar por rango de precios
   * @param category
   */
  onCategorySelected(category: string): void {
    this.filtersChanged.emit({ category });
  }

  /**
   * Función para buscar
   * @param query
   */
  onSearch(query: string): void {
    this.filtersChanged.emit({ q: query });
  }
}
