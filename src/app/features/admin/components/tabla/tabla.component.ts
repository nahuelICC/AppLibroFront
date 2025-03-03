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

/**
 * Componente que muestra una tabla de datos
 */
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

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
    document.getElementById('clientes')?.classList.remove('hidden');
    this.cargaEstados();
    this.updatePagination();
  }

  /**
   * Detecta cambios en los datos de entrada
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos']) {
      this.updatePagination();
    }
  }

  /**
   * Carga los estados de los pedidos
   */
  cargaEstados(): void {
    this.pedidoService.getEstados().subscribe((res: any[]) => {
      this.estados = res;
    });
  }

  /**
   * Filtra la data según el término de búsqueda
   */
  get filteredData(): any[] {
    return this.filtroPipe.transform(this.datos, this.buscador);
  }

  /**
   * Devuelve la data paginada
   */
  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  /**
   * Devuelve el índice global de un elemento en la tabla
   * @param index
   */
  getGlobalIndex(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index;
  }

  /**
   * Actualiza la paginación
   */
  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.displayedPages = this.getDisplayedPages();
  }

  /**
   * Devuelve las páginas a mostrar en la paginación
   */
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

  /**
   * Cambia a la página anterior
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  /**
   * Cambia a la página siguiente
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /**
   * Cambia a una página concreta
   * @param page
   */
  setPage(page: number | string): void {
    if (typeof page !== 'number') {
      return; // Ignoramos si es "..."
    }
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  /**
   * Actualiza la búsqueda
   */
  onSearchChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Devuelve el nombre del estado
   * @param est
   */
  getEstadoNombre(est: string): string | undefined {
    const estado = this.estados.find(e => e === est);
    return estado ? estado : 'Desconocido';
  }

  /**
   * Inicia la edición de una fila
   * @param paginatedIndex
   */
  editRow(paginatedIndex: number): void {
    if (this.editingRow !== null) return;

    // Obtener el item real de los datos filtrados
    const item = this.paginatedData[paginatedIndex];

    // Buscar el índice en el array original
    const originalIndex = this.datos.indexOf(item);

    if (originalIndex === -1) return;

    this.originalData = { ...this.datos[originalIndex] };
    const formConfig: { [key: string]: any } = {};

    this.columnas.forEach(col => {
      if (col.editable) {
        formConfig[col.campo] = [
          this.datos[originalIndex][col.campo],
          this.validadores[col.campo] || []
        ];
      }
    });

    this.editingForm = this.fb.group(formConfig);
    this.editingRow = originalIndex;
  }

  /**
   * Guarda los cambios de la fila editada
   */
  saveRow(): void {
    if (this.editingForm && this.editingForm.valid && this.editingRow !== null) {
      const updatedData = {
        ...this.datos[this.editingRow],
        ...this.editingForm.value
      };

      this.datos = this.datos.map((item, index) =>
        index === this.editingRow ? updatedData : item
      );

      this.actualizarFila.emit(updatedData);

      this.cancelEdit();
      this.updatePagination();
    }
  }

  /**
   * Cancela la edición de la fila
   */
  cancelEdit(): void {
    this.editingForm = null;
    this.editingRow = null;
    this.originalData = null;
    this.datos = [...this.datos];
  }

  /**
   * Elimina una fila
   * @param index
   */
  deleteRow(index: number): void {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.datos.splice(index, 1);
      this.updatePagination();
    }
  }

  /**
   * Comprueba si un valor es booleano
   * @param value
   */
  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  /**
   * Activa o desactiva un campo booleano
   * @param campo
   */
  toggleCheck(campo: string): void {
    if (this.editingForm) {
      const currentValue = this.editingForm.get(campo)?.value;
      this.editingForm.get(campo)?.setValue(!currentValue);
    }
  }

  /**
   * Devuelve el mensaje de error de un campo
   * @param campo
   */
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

  /**
   * Devuelve el control de un campo
   * @param campo
   */
  getFormControl(campo: string): FormControl {
    return this.editingForm?.get(campo) as FormControl;
  }

  /**
   * Devuelve el valor de un campo
   */

  get paginacion() {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      displayedPages: this.displayedPages
    };
  }
}
