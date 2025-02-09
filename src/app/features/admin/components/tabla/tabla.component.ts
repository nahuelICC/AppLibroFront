import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {UsuarioTablaDTO} from '../../DTO/UsuarioTablaDTO';
import {UsuarioService} from '../../services/usuario.service';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {FiltroBuscadorPipe} from '../../pipes/filtro-buscador.pipe';

@Component({
  selector: 'app-tabla',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    NgClass,
    MatIcon,
    FiltroBuscadorPipe
  ],
  templateUrl: './tabla.component.html',
  standalone: true,
  styleUrl: './tabla.component.css'
})
export class TablaComponent {
  @Input() datos: any[] = [];
  // Configuración de columnas: un array de objetos con título y campo
  @Input() columnas: { titulo: string; campo: string; editable: boolean}[] = [];
  @Output() actualizarFila = new EventEmitter<any>();
  buscador: any;

  // Índice de la fila en edición. Si es null, ninguna está en edición.
  editingRow: number | null = null;

  constructor(private usuarioService: UsuarioService) {}

  // Activa el modo edición en la fila indicada
  editRow(index: number): void {
    this.editingRow = index;
  }

  // Guarda los cambios y envía la actualización al backend
  saveRow(index: number) {
    const registroActualizado = { ...this.datos[index] };
    this.actualizarFila.emit(registroActualizado); // Envía el usuario actualizado al padre
    this.editingRow = null;
  }

  // Cancela la edición (aquí podrías recargar los datos originales si es necesario)
  cancelEdit(index: number): void {
    // Si quieres restaurar datos originales, deberías tener una copia previa.
    this.editingRow = null;
  }

  // Método para eliminar la fila (opcional)

  deleteRow(index: number): void {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      // Lógica para eliminar el usuario en el backend
      // Por ejemplo, podrías llamar a un método this.usuarioService.deleteUsuario(...)
      this.datos.splice(index, 1);
    }
  }
  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }
  toggleCheck(item: any, campo: string): void {
    item[campo] = !item[campo]; // Alterna entre true y false
  }
}
