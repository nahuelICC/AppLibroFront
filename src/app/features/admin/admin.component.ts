import {Component, OnInit} from '@angular/core';
import {TablaComponent} from './components/tabla/tabla.component';
import {UsuarioService} from './services/usuario.service';
import {UsuarioTablaDTO} from './DTO/UsuarioTablaDTO';
import {ClienteService} from './services/cliente.service';
import {ClientesTablaDTO} from './DTO/ClientesTablaDTO';
import { Validators } from '@angular/forms';
import {PedidoService} from "./services/pedido.service";
import {PedidosTablaDTO} from "./DTO/PedidosTablaDTO";
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    TablaComponent,
    NgIf
  ],
  templateUrl: './admin.component.html',
  standalone: true,
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  titulo: string = 'Clientes';
  activeTabId: string = 'clientes';

  clientesData: any[] = [];
  pedidosData: any[] = [];

  clientesColumnas: any[] = [];
  pedidosColumnas: any[] = [];

  clientesValidadores: any = {};
  pedidosValidadores: any = {};

  clientesCargados: boolean = false;
  pedidosCargados: boolean = false;


  configurarTablaHijo!: (tipoTabla: string) => void;

  constructor(private clienteService: ClienteService,
              private pedidoService: PedidoService) {
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  showTable(tablaId: string, btnActual: EventTarget | null): void {
    this.activeTabId = tablaId;
    this.titulo = tablaId === 'clientes' ? 'Clientes' : 'Pedidos';

    if (tablaId === 'clientes' && !this.clientesCargados) {
      this.cargarClientes();
      this.clientesCargados = true;
    } else if (tablaId === 'pedidos' && !this.pedidosCargados) {
      this.cargarPedidos();
      this.pedidosCargados = true;
    }

    this.estiloBotones(btnActual);
  }

  private estiloBotones(btnActual: EventTarget | null | HTMLElement) {
    document.getElementById('btnUsuarios')?.classList.remove('bg-gray-200');
    document.getElementById('btnPedidos')?.classList.remove('bg-gray-200',);
    if (btnActual instanceof HTMLElement) {
      btnActual.classList.add('bg-gray-200');
    }
  }

//carga de tabla Ususarios
  private cargarClientes() {
    this.clientesColumnas = [
      { titulo: 'Usuario', campo: 'usuario', editable: false, isEstado: false},
      { titulo: 'Email', campo: 'email', editable: false, isEstado: false},
      { titulo: 'Activo', campo: 'activo', editable: true, isEstado: false},
      { titulo: 'Nombre', campo: 'nombre', editable: true, isEstado: false},
      { titulo: 'Apellido', campo: 'apellido', editable: true, isEstado: false},
      { titulo: 'Telefono', campo: 'telefono', editable: true, isEstado: false},
      { titulo: 'Direccion', campo: 'direccion', editable: true, isEstado: false},
      { titulo: 'Suscrito', campo: 'suscrito', editable: true, isEstado: false}
    ];
    this.clientesValidadores = {
      nombre: [Validators.required, Validators.minLength(3)],
      apellido: [Validators.required, Validators.minLength(4)],
      telefono: [Validators.required, Validators.pattern(/^\d{9}$/)],
      direccion: [Validators.required]

    };
    this.clientesData = [];
    this.clienteService.getClientesTabla().subscribe({
      next: (res: ClientesTablaDTO[]) => {
        this.clientesData = res;
        this.clientesCargados = true;
      },
      error: (err) => {
        console.error('Error cargando clientes:', err);
        this.clientesCargados = false; // Permite reintentar
      }
    });
  }

  //carga de tabla pedidos
  private cargarPedidos() {
    this.pedidosColumnas = [
      { titulo: 'Usuario', campo: 'usuario', editable: false, isEstado: false},
      { titulo: 'Referencia', campo: 'referencia', editable: false, isEstado: false},
      { titulo: 'Estado', campo: 'estado', editable: true, isEstado: true},
      { titulo: 'Fecha', campo: 'fecha', editable: false, isEstado: false},
      { titulo: 'Direccion', campo: 'direccion', editable: false, isEstado: false}
    ];
    this.pedidosValidadores = {};

    this.pedidosData = [];

    this.pedidoService.getPedidosTabla().subscribe({
      next: (res: PedidosTablaDTO[]) => {
        this.pedidosData = res;
        this.pedidosCargados = true;
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.pedidosCargados = false;
      }
    });
  }

  onActualizarFila(item: any) {
    if (this.titulo === 'Clientes') {
      this.clienteService.modificarCliente(item).subscribe(
        response => console.log('Usuario actualizado', response),
        error => console.error('Error al actualizar usuario', error)
      );
    } else if(this.titulo=== 'Pedidos'){
      this.pedidoService.modificarPedido(item).subscribe(
        reponse => console.log('Pedido actualizado', reponse),
        error => console.error('Error al actualizar pedido', error)
      );
    } else {

    }
  }
}
