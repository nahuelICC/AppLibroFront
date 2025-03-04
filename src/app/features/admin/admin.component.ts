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
import {LibrosService} from './services/libros.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatIcon} from '@angular/material/icon';
import {NotificacionesService} from '../../shared/services/notificaciones.service';
import {AlertInfoComponent, AlertType} from '../../shared/components/alert-info/alert-info.component';

/**
 * Componente que muestra la vista de administrador
 */
@Component({
  selector: 'app-admin',
  imports: [
    TablaComponent,
    NgIf,
    MatIcon,
    AlertInfoComponent
  ],
  templateUrl: './admin.component.html',
  standalone: true,
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  titulo: string = 'Clientes';
  idTablaActiva: string = 'clientes';

  clientesData: any[] = [];
  pedidosData: any[] = [];
  librosData: any[] = [];

  clientesColumnas: any[] = [];
  pedidosColumnas: any[] = [];
  librosColumnas: any[] = [];

  clientesValidadores: any = {};
  pedidosValidadores: any = {};
  librosValidadores: any = {};

  clientesCargados: boolean = false;
  pedidosCargados: boolean = false;
  librosCargados: boolean = false;

  configurarTablaHijo!: (tipoTabla: string) => void;

  isMenuOpen = true;
  isMobile = false;

  //alerta
  alertaVisible: boolean = false;
  tipoAlerta: AlertType = 'success';
  mensajeAlerta: string = '';

  constructor(private clienteService: ClienteService,
              private pedidoService: PedidoService,
              private librosService: LibrosService,
              private breakpointObserver: BreakpointObserver,
              private notificacionesService: NotificacionesService) {
  }

  /**
   * Carga los clientes
   */
  ngOnInit(): void {
    this.cargarClientes();
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isMobile = result.matches;
      this.isMenuOpen = !this.isMobile;
    });
  }

  /**
   * Muestra u oculta el menú
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Muestra la tabla seleccionada
   * @param tablaId
   * @param btnActual
   */
  muestraTabla(tablaId: string, btnActual: EventTarget | null): void {
    this.idTablaActiva = tablaId;

    this.titulo = tablaId.charAt(0).toUpperCase() + tablaId.slice(1);

    if (tablaId === 'clientes' && !this.clientesCargados) {
      this.cargarClientes();
      this.clientesCargados = true;
    } else if (tablaId === 'pedidos' && !this.pedidosCargados) {
      this.cargarPedidos();
      this.pedidosCargados = true;
    }else if (tablaId === 'libros' && !this.librosCargados) {
      this.cargarLibros();
      this.librosCargados = true;
    }

    this.estiloBotones(btnActual);
  }

  /**
   * Estilo de los botones
   * @param btnActual
   * @private
   */
  private estiloBotones(btnActual: EventTarget | null | HTMLElement) {
    document.getElementById('btnUsuarios')?.classList.remove('bg-gray-200');
    document.getElementById('btnPedidos')?.classList.remove('bg-gray-200',);
      document.getElementById('btnLibros')?.classList.remove('bg-gray-200',);
    if (btnActual instanceof HTMLElement) {
      btnActual.classList.add('bg-gray-200');
    }
  }

  /**
   * Carga los clientes
   */
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

  /**
   * Carga los pedidos
   * @private
   */
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

  /**
   * Carga los libros
   * @private
   */
  private cargarLibros() {
    this.librosColumnas = [
      { titulo: 'Titulo', campo: 'titulo', editable: false, isEstado: false},
      { titulo: 'Autor', campo: 'autor', editable: false, isEstado: false},
      { titulo: 'ISBN', campo: 'isbn', editable: false, isEstado: false},
      { titulo: 'En venta', campo: 'enVenta', editable: false, isEstado: false}
    ];

    this.librosValidadores = {
      precio : [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
    };

    this.librosData = [];

    this.librosService.getLibrosTabla().subscribe({
      next: (res: any[]) => {
        this.librosData = res;
        this.librosCargados = true;
      },
      error: (err) => {
        console.error('Error cargando libros:', err);
        this.librosCargados = false;
      }
    });
  }

  /**
   * Actualiza la fila
   * @param item
   */
  actualizarRegistro(item: any) {
    if (this.titulo === 'Clientes') {
      this.clienteService.modificarCliente(item).subscribe({
        next: (response) => {
          console.log('Usuario actualizado', response);
          this.alertaVisible = true;
          this.tipoAlerta = 'success';
          this.mensajeAlerta = 'Cliente actualizado con éxito.';
      },
        error: (error) => {
          console.error('Error al actualizar usuario', error);
          this.alertaVisible = true;
          this.tipoAlerta = 'error';
          this.mensajeAlerta = 'Error al actualizar cliente.';
        }
      });
    } else if(this.titulo=== 'Pedidos'){
      this.pedidoService.modificarPedido(item).subscribe({
        next: (response) => {
          console.log('Pedido actualizado', response);
          this.notificacionesService.actualizarCantidadNotificaciones();
          this.alertaVisible = true;
          this.tipoAlerta = 'success';
          this.mensajeAlerta = 'Pedido actualizado con éxito.';
        },
        error: (error) => {
          console.error('Error al actualizar pedido', error);
          this.alertaVisible = true;
          this.tipoAlerta = 'error';
          this.mensajeAlerta = 'Error al actualizar pedido.'
        }
      });
    } else if(this.titulo=== 'Libros') {

    }else {

    }

    setTimeout(() => {
      this.alertaVisible = false;
    }, 2000);

  }

}
