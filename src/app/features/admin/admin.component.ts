import {Component, OnInit} from '@angular/core';
import {TablaComponent} from './components/tabla/tabla.component';
import {UsuarioService} from './services/usuario.service';
import {UsuarioTablaDTO} from './DTO/UsuarioTablaDTO';
import {ClienteService} from './services/cliente.service';
import {ClientesTablaDTO} from './DTO/ClientesTablaDTO';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [
    TablaComponent
  ],
  templateUrl: './admin.component.html',
  standalone: true,
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  titulo: string = 'Clientes';
  datos: any[] = [];
  configColumnas: { titulo: string; campo: string, editable: boolean}[] = [];
  validadores: any;
  constructor(private clienteService: ClienteService) {
  }

  ngOnInit(): void {
    // Carga por defecto los usuarios
    this.cargarUsuarios();
    document.getElementById('clientes')?.classList.remove('hidden');
  }

  showTable(tablaId: string, btnActual: EventTarget | null): void {
    // Ocultar todas las tablas
    document.getElementById('clientes')?.classList.add('hidden');
    document.getElementById('pedidos')?.classList.add('hidden');

    // Remover estilos de botón activo
    document.getElementById('btnUsuarios')?.classList.remove('bg-gray-200');
    document.getElementById('btnPedidos')?.classList.remove('bg-gray-200',);

    // Mostrar la tabla seleccionada
    document.getElementById(tablaId)?.classList.remove('hidden');

    // Cambiar título de la sección
    const titulo = tablaId === 'clientes' ? 'Clientes' : 'Pedidos';
    const tituloElement = document.getElementById('tituloSeccion');
    if (tituloElement) {
      tituloElement.textContent = titulo;
    }

    // Aplicar estilos al botón activo
    // Aseguramos que btnActual es un HTMLElement
    if (btnActual instanceof HTMLElement) {
        btnActual.classList.add('bg-gray-200');
    }
  }

  private cargarUsuarios() {
    this.titulo = 'Clientes';
    // Configuración de columnas para Usuarios
    this.configColumnas = [
      { titulo: 'Usuario', campo: 'usuario', editable: false},
      { titulo: 'Email', campo: 'email', editable: false},
      { titulo: 'Activo', campo: 'activo', editable: true},
      { titulo: 'Nombre', campo: 'nombre', editable: true},
      { titulo: 'Apellido', campo: 'apellido', editable: true},
      { titulo: 'Telefono', campo: 'telefono', editable: true},
      { titulo: 'Direccion', campo: 'direccion', editable: true},
      { titulo: 'Suscrito', campo: 'suscrito', editable: true}
    ];
    this.validadores = {
      nombre: [Validators.required, Validators.minLength(3)],
      apellido: [Validators.required, Validators.minLength(4)],
      telefono: [Validators.required, Validators.pattern(/^\d{9}$/)],
      direccion: [Validators.required]

    };
    // Llamada al servicio para obtener los usuarios
    this.clienteService.getClientesTabla().subscribe((res: ClientesTablaDTO[]) => {
      this.datos = res;
    });
  }

  onActualizarFila(item: any) {
    if (this.titulo === 'Clientes') {
      this.clienteService.modificarCliente(item).subscribe(
        response => console.log('Usuario actualizado', response),
        error => console.error('Error al actualizar usuario', error)
      );
    } else {
    }
  }
}
