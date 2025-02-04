import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RangoPrecioComponent} from '../rango-precio/rango-precio.component';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CategoriasComponent} from '../categorias/categorias.component';
import {BuscadorComponent} from '../buscador/buscador.component';

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

  onSearchInput(query: string): void {
    this.searchSubject.next(query);
  }

  // Ejemplo: Filtro por categoría
  onCategorySelected(category: string): void {
    this.filtersChanged.emit({ category });
  }

  // Ejemplo: Filtro por búsqueda
  onSearch(query: string): void {
    this.filtersChanged.emit({ q: query });
  }
}
