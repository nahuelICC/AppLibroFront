import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

@Component({
  selector: 'app-buscador',
  imports: [
    FormsModule
  ],
  templateUrl: './buscador.component.html',
  standalone: true,
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent {
  @Output() searchChange = new EventEmitter<string>();
  private searchSubject = new Subject<string>();
  searchText:string = '';

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.searchChange.emit(query));
  }

  onSearchInput(query: string): void {
    this.searchSubject.next(query);
  }
}
