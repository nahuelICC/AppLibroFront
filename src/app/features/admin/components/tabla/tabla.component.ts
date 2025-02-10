import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    FiltroBuscadorPipe
  ],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  @Input() datos: any[] = [];
  @Input() columnas: { titulo: string; campo: string; editable: boolean }[] = [];
  @Output() actualizarFila = new EventEmitter<any>();
  @Input() validadores: { [key: string]: ValidatorFn[] } = {};
  @Input() tablaActiva: string = '';

  buscador: string = '';
  editingForm: FormGroup | null = null;
  editingRow: number | null = null;
  originalData: any;


  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    document.getElementById('clientes')?.classList.remove('hidden');
  }

  editRow(index: number): void {
    if (this.editingRow !== null) return; // Evitar edición múltiple

    this.originalData = { ...this.datos[index] };
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
      // 1. Actualizar el registro local
      const updatedData = {
        ...this.datos[this.editingRow],
        ...this.editingForm.value
      };

      // 2. Actualizar el array (crear nueva referencia)
      this.datos = this.datos.map((item, index) =>
        index === this.editingRow ? updatedData : item
      );

      // 3. Emitir el evento
      this.actualizarFila.emit(updatedData);

      // 4. Resetear estado de edición
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingForm = null;
    this.editingRow = null;
    this.originalData = null;

    // Forzar detección de cambios si es necesario
    this.datos = [...this.datos];
  }

  deleteRow(index: number): void {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.datos.splice(index, 1);
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
    if (control.errors['pattern']){
      return 'Debe contener 9 dígitos'
    }
    return '';
  }
  getFormControl(campo: string): FormControl {
    return this.editingForm?.get(campo) as FormControl;
  }
}
