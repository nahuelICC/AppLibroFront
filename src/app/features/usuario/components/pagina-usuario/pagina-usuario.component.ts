import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {EditaUsuarioDTO} from '../../DTOs/EditaUsuarioDTO';
import {AlertConfirmarComponent} from '../../../../shared/components/alert-confirmar/alert-confirmar.component';
import {AlertInfoComponent, AlertType} from '../../../../shared/components/alert-info/alert-info.component';

@Component({
  selector: 'app-pagina-usuario',
  imports: [
    BotonComponent,
    NgIf,
    DatePipe,
    NgForOf,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    AlertConfirmarComponent,
    AlertInfoComponent
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
  showConfirmEdit: boolean = false;
  alertMessage: string = '';
  alertType: AlertType = 'success';
  isAlertVisible: boolean = false;
  provincias:string[] = ['Álava','Albacete','Alicante','Almería','Asturias','Ávila','Badajoz','Barcelona','Burgos','Cáceres','Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','Cuenca','Gerona','Granada','Guadalajara','Guipúzcoa','Huelva','Huesca','Islas Baleares','Jaén','La Coruña','La Rioja','Las Palmas','León','Lérida','Lugo','Madrid','Málaga','Murcia','Navarra','Orense','Palencia','Pontevedra','Salamanca','Santa Cruz de Tenerife','Segovia','Sevilla','Soria','Tarragona','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza'];

  constructor(private perfilUsuarioService: PerfilUsuarioService,private fb: FormBuilder,private cdRef: ChangeDetectorRef, private zone: NgZone) {
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
        console.log((data))
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
        this.alertMessage = 'Perfil actualizado correctamente';
        this.alertType = 'success';
        this.isAlertVisible = true;
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err)
        this.alertMessage = 'Error al editar el perfil';
        this.alertType = 'warning';
        this.isAlertVisible = true;
      }

    });
    setTimeout(() => {
      this.zone.run(() => {
        this.isAlertVisible = false;
        this.cdRef.detectChanges(); // Asegura que Angular detecte el cambio
      });
    }, 5000);
  }

  toggleEditarDireccion() {
    if (this.editandoDireccion) {
      // Verifica que todos los campos estén completos
      if (this.direccionPartes.some(part => part === "")) {
        console.log('Todos los campos son obligatorios');
        return;
      }

      this.datosCliente.direccion = this.direccionPartes.join(", ");
      this.perfilUsuarioService.putEdicionDireccion(this.datosCliente.direccion).subscribe({
        next: (response) => {
          console.log('Dirección actualizada:', response);
          this.alertMessage = 'Dirección actualizada correctamente';
          this.alertType = 'success';
          this.isAlertVisible = true;
        },
        error: (err) => {
          console.error('Error actualizando dirección:', err);
          this.alertMessage = 'Error al actualizar la dirección';
          this.alertType = 'warning';
          this.isAlertVisible = true;
        }
      });
      setTimeout(() => {
        this.zone.run(() => {
          this.isAlertVisible = false;
          this.cdRef.detectChanges();
        });
      }, 5000);
    } else {
      this.direccionPartes = this.datosCliente.direccion.split(", ");
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
        this.showConfirmEdit = false;
        this.alertMessage = 'Contraseña cambiada correctamente';
        this.alertType = 'success';
        this.isAlertVisible = true;
        console.log('Contraseña cambiada:', response);
        this.toggleCambioContrasena();
        // Cierra el formulario solo si fue exitoso
      },
      error: (err) => {
        console.error('Error cambiando contraseña:', err);
        this.showConfirmEdit = false;
        this.alertMessage = 'Error al cambiar la contraseña';
        this.alertType = 'warning';
        this.isAlertVisible = true;
        // Opcional: mantener el formulario abierto en caso de error
      }

    });
    setTimeout(() => {
      this.zone.run(() => {
        this.isAlertVisible = false;
        this.cdRef.detectChanges(); // Asegura que Angular detecte el cambio
      });
    }, 5000);
  }

  get nuevaContrasena() {
    return this.cambioContrasenaForm.get('nueva');
  }
}
