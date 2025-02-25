import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { FiltroBuscadorPipe } from '../../pipes/filtro-buscador.pipe';
import { PedidoService } from "../../services/pedido.service";
import { RouterLink } from '@angular/router';
import {AlertInfoComponent} from '../../../../shared/components/alert-info/alert-info.component';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    MatIcon,
    FiltroBuscadorPipe,
    RouterLink,
    AlertInfoComponent
  ],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, OnChanges {
  @Input() datos: any[] = [];
  @Input() columnas: { titulo: string; campo: string; editable: boolean; isEstado: boolean }[] = [];
  @Output() actualizarFila = new EventEmitter<any>();
  @Input() validadores: { [key: string]: ValidatorFn[] } = {};
  @Input() tablaActiva: string = '';

  buscador: string = '';
  editingForm: FormGroup | null = null;
  editingRow: number | null = null;
  originalData: any;
  estados: string[] = [];

  // Paginación
  pageSize: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  displayedPages: (number | string)[] = [];

  private filtroPipe: FiltroBuscadorPipe = new FiltroBuscadorPipe();



  constructor(private fb: FormBuilder, private pedidoService: PedidoService) {}

  ngOnInit(): void {
    document.getElementById('clientes')?.classList.remove('hidden');
    this.cargaEstados();
    this.updatePagination();
  }

  // Detectamos cambios en los inputs, en particular en "datos"
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos']) {
      this.updatePagination();
    }
  }

  cargaEstados(): void {
    this.pedidoService.getEstados().subscribe((res: any[]) => {
      this.estados = res;
    });
  }

  // Retorna la data filtrada según el término de búsqueda
  get filteredData(): any[] {
    return this.filtroPipe.transform(this.datos, this.buscador);
  }

  // Retorna la data de la página actual
  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  // Calcula el índice global a partir del índice relativo de la página
  getGlobalIndex(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index;
  }

  // Actualiza la paginación según la data filtrada
  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.displayedPages = this.getDisplayedPages();
  }

  // Genera el listado de páginas a mostrar (incluyendo "..." si son muchas)
  getDisplayedPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
      } else if (this.currentPage > total - 4) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', total);
      }
    }
    return pages;
  }

  // Métodos para controlar la paginación
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Acepta número o string, pero solo procesa números
  setPage(page: number | string): void {
    if (typeof page !== 'number') {
      return; // Ignoramos si es "..."
    }
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Cuando se cambia el término de búsqueda se reinicia a la página 1
  onSearchChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getEstadoNombre(est: string): string | undefined {
    const estado = this.estados.find(e => e === est);
    return estado ? estado : 'Desconocido';
  }

  // Nota: se recibe el índice global (no el relativo de la página)
  editRow(index: number): void {
    if (this.editingRow !== null) return; // Evitar edición múltiple

    const globalIndex = this.getGlobalIndex(index);
    this.originalData = { ...this.datos[globalIndex] };
    const formConfig: { [key: string]: any } = {};

    this.columnas.forEach(col => {
      if (col.editable) {
        formConfig[col.campo] = [
          this.datos[index][col.campo],
          this.validadores[col.campo] || []
        ];
      }
    });

    this.editingForm = this.fb.group(formConfig);
    this.editingRow = index;
  }

  saveRow(): void {
    if (this.editingForm && this.editingForm.valid && this.editingRow !== null) {
      // Actualizamos el registro local
      const updatedData = {
        ...this.datos[this.editingRow],
        ...this.editingForm.value
      };

      // Se reemplaza el registro en el array (nueva referencia)
      this.datos = this.datos.map((item, index) =>
        index === this.editingRow ? updatedData : item
      );

      // Emitimos el evento para informar del cambio
      this.actualizarFila.emit(updatedData);

      // Finalizamos la edición
      this.cancelEdit();
      this.updatePagination();
    }
  }

  cancelEdit(): void {
    this.editingForm = null;
    this.editingRow = null;
    this.originalData = null;
    this.datos = [...this.datos];
  }

  deleteRow(index: number): void {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.datos.splice(index, 1);
      this.updatePagination();
    }
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  toggleCheck(campo: string): void {
    if (this.editingForm) {
      const currentValue = this.editingForm.get(campo)?.value;
      this.editingForm.get(campo)?.setValue(!currentValue);
    }
  }

  getControlError(campo: string): string {
    const control = this.getFormControl(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Campo requerido';
    }
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['email']) {
      return 'Formato de email inválido';
    }
    if (control.errors['pattern']) {
      return 'Debe contener 9 dígitos';
    }
    return '';
  }

  getFormControl(campo: string): FormControl {
    return this.editingForm?.get(campo) as FormControl;
  }

  // Objeto auxiliar para usar en el HTML de paginación

  get paginacion() {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      displayedPages: this.displayedPages
    };
  }
}
