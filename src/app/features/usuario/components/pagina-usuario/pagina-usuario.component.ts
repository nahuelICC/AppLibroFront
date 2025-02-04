import { Component, OnInit } from '@angular/core';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {EditaUsuarioDTO} from '../../DTOs/EditaUsuarioDTO';

@Component({
  selector: 'app-pagina-usuario',
  imports: [
    BotonComponent,
    NgIf,
    DatePipe,
    NgForOf,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pagina-usuario.component.html',
  standalone: true,
  styleUrl: './pagina-usuario.component.css'
})
export class PaginaUsuarioComponent implements OnInit {
  pedidosAbiertos: { [key: number]: boolean } = {};
  pedidosCargados: { [key: number]: boolean } = {};
  datosCliente: any = { pedidos: [] };
  editandoPerfil = false;
  datosClienteOriginal: any;
  datosEdicion:EditaUsuarioDTO = new EditaUsuarioDTO();
  editandoDireccion = false;
  direccionPartes: string[] = ["", "", "", ""];
  mostrandoCambioContrasena = false;
  cambioContrasenaForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 3;

  constructor(private perfilUsuarioService: PerfilUsuarioService,private fb: FormBuilder) {
    this.cambioContrasenaForm = this.fb.group({
      actual: ['', Validators.required],
      nueva: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      repetir: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatosCliente();
  }

  get pedidosMostrados() {
    return this.datosCliente.pedidos.slice(0, this.currentPage * this.itemsPerPage);
  }

  get totalPaginas(): number {
    return Math.ceil(this.datosCliente.pedidos.length / this.itemsPerPage);
  }

  cargarMenosPedidos() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  cargarMasPedidos() {
    this.currentPage++;
  }



  private cargarDatosCliente(): void {
    this.perfilUsuarioService.getDatosCliente().subscribe({
      next: (data) => {
        this.datosCliente = data;
        if (this.datosCliente.pedidos) {
          this.datosCliente.pedidos.forEach((pedido: any) => {
            this.pedidosAbiertos[pedido.id] = false;
            this.pedidosCargados[pedido.id] = false;
          });
        }
      },
      error: (err) => console.error('Error cargando datos:', err)
    });
  }

  toggleDropdown(pedido: any): void {
    const pedidoId = pedido.id;

    if (!this.pedidosCargados[pedidoId]) {
      this.cargarDetallesPedido(pedidoId);
      this.pedidosCargados[pedidoId] = true;
    }

    this.pedidosAbiertos[pedidoId] = !this.pedidosAbiertos[pedidoId];
  }

  private cargarDetallesPedido(pedidoId: number): void {
    this.perfilUsuarioService.getDetallesPedido(pedidoId).subscribe({
      next: (detalles) => {
        const pedidoIndex = this.datosCliente.pedidos.findIndex((p: any) => p.id === pedidoId);
        if (pedidoIndex > -1) {
          this.datosCliente.pedidos[pedidoIndex].detalles = detalles;
          console.log('Detalles cargados:', detalles);
        }
      },
      error: (err) => console.error('Error cargando detalles:', err)
    });
  }

  calcularTotalPedido(pedido: any): number {
    return pedido.detalles.reduce((total: number, producto: any) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  toggleEditarPerfil() {
    if (this.editandoPerfil) {
      this.guardarCambios();
    } else {
      this.datosClienteOriginal = {...this.datosCliente};
    }
    this.editandoPerfil = !this.editandoPerfil;
  }

  guardarCambios() {
    this.datosEdicion.nombre = this.datosCliente.nombre;
    this.datosEdicion.apellido = this.datosCliente.apellido;
    this.datosEdicion.email = this.datosCliente.email;
    this.datosEdicion.telefono = this.datosCliente.telefono;

    if (this.datosEdicion.nombre === "" || this.datosEdicion.apellido === "" || this.datosEdicion.email === "" || this.datosEdicion.telefono === "") {
      console.log('Todos los campos son obligatorios');
      return;
    }

    this.perfilUsuarioService.putEdicionPerfil(this.datosEdicion).subscribe({
      next: (response) => {
        console.log('Perfil actualizado:', response);
      },
      error: (err) => console.error('Error actualizando perfil:', err)
    });
  }

  toggleEditarDireccion() {
    if (this.editandoDireccion) {

      if (this.direccionPartes.some(part => part === "")) {
        console.log('Todos los campos son obligatorios');
        return;
      }

      this.datosCliente.direccion = this.direccionPartes.join(",");
      this.perfilUsuarioService.putEdicionDireccion(this.datosCliente.direccion).subscribe({
        next: (response) => {
          console.log('Dirección actualizada:', response);
        },
        error: (err) => console.error('Error actualizando dirección:', err)
      });
    } else {
      // Dividir la dirección en partes
      this.direccionPartes = this.datosCliente.direccion.split(",");
    }
    this.editandoDireccion = !this.editandoDireccion;
  }

  toggleCambioContrasena() {
    this.mostrandoCambioContrasena = !this.mostrandoCambioContrasena;
    if (!this.mostrandoCambioContrasena) {
      this.cambioContrasenaForm.reset();
    }
  }

  enviarCambioContrasena() {
    if (this.cambioContrasenaForm.invalid) return;

    if (this.cambioContrasenaForm.value.nueva !== this.cambioContrasenaForm.value.repetir) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }

    this.perfilUsuarioService.postCambioContrasena(this.cambioContrasenaForm.value).subscribe({
      next: (response) => {
        console.log('Contraseña cambiada:', response);
        this.toggleCambioContrasena(); // Cierra el formulario solo si fue exitoso
      },
      error: (err) => {
        console.error('Error cambiando contraseña:', err);
        // Opcional: mantener el formulario abierto en caso de error
      }
    });
  }

  get nuevaContrasena() {
    return this.cambioContrasenaForm.get('nueva');
  }
}
