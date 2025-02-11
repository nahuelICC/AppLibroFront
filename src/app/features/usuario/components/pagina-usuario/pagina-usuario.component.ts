import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {PerfilUsuarioService} from '../../services/perfil-usuario.service';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {MatIcon} from '@angular/material/icon';
import {CurrencyPipe, DatePipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {EditaUsuarioDTO} from '../../DTOs/EditaUsuarioDTO';
import {AlertConfirmarComponent} from '../../../../shared/components/alert-confirmar/alert-confirmar.component';
import {AlertInfoComponent, AlertType} from '../../../../shared/components/alert-info/alert-info.component';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

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
    AlertInfoComponent,
    MatIcon,
    TitleCasePipe
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
  estadoSuscripcion:boolean = true;
  showGestionSuscripcion:boolean = false;
  showConfirmCancel:boolean = false;
  showConfirmRenew:boolean = false;
  generos: string[] = ["Novela Negra", "Thriller", "Novela Historica", "Romantica", "Ciencia Ficcion", "Distopia", "Aventuras", "Fantasia", "Contemporaneo", "Terror", "Paranormal", "Poesia", "Juvenil", "Infantil", "Autoayuda", "Salud Y Deporte", "Manuales", "Memorias", "Biografias", "Cocina", "Viajes", "Libros Tecnicos", "Referencia", "Divulgativos", "Libros De Texto", "Arte"];
  editandoGenero: boolean = false;
  generoSeleccionado: number = 0;

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
        console.log('Datos cargados:', this.datosCliente);
        this.estadoSuscripcion = this.datosCliente.suscripcion.suscrito;
        this.generoSeleccionado = this.datosCliente.suscripcion.genero -1;

        if (this.datosCliente.pedidos) {
          this.datosCliente.pedidos.forEach((pedido: any) => {
            pedido.genero = pedido.genero.replace("_", " ");
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

  descargarDetalles(pedidoId: number): void {
    this.perfilUsuarioService.getDetallesPedido(pedidoId).subscribe({
      next: (detalles) => {
        const pedidoIndex = this.datosCliente.pedidos.findIndex((p: any) => p.id === pedidoId);
        const pedido = this.datosCliente.pedidos[pedidoIndex];
        if (pedidoIndex > -1) {
          this.datosCliente.pedidos[pedidoIndex].detalles = detalles;

          // Generar el PDF
          this.generarPDF(detalles,pedido,this.datosCliente);
        }
      },
      error: (err) => console.error('Error al descargar detalles:', err)
    });
  }

  generarPDF(detalles: any, pedido: any,datosCliente:any): void {
    const isMistery = pedido.esMistery && ![5, 6].includes(pedido.estado);

    console.log('Pedido:', pedido);
    console.log(datosCliente);

    // Crear elemento HTML temporal
    const div = document.createElement('div');

    // Plantilla condicional
    div.innerHTML = isMistery ? `
    <div class="container">
      <div class="header">
        <img src="assets/Logo.png" alt="Tinteka">
        <h1>TIENES UN NUEVO ENVÍO MISTERY</h1>
        <h2>Detalles del Pedido Mistery</h2>
        <p>Pedido: ${pedido.referencia}</p>
        <p>Cliente: ${datosCliente.nombre} ${datosCliente.apellido}</p>
        <p>Fecha: ${new Date(pedido.fecha).toLocaleString()}</p>
      </div>
      <div class="details">
        <p>Suscripción: <b>${datosCliente.suscripcion.tipo}</b></p>
        <p>Libros enviados: ${detalles.length}</p>
        <p>Género: ${pedido.genero}</p>
      </div>
      <div class="footer">
        <p>Si tienes alguna pregunta, contacta en <a href="mailto:contacto.tinteka@gmail.com">contacto.tinteka@gmail.com</a>.</p>
      </div>
    </div>
  ` : `
    <div class="container">
      <div class="header">
        <img src="assets/Logo.png" alt="Tinteka">
        <h1>Detalles del Pedido</h1>
        <p>Referencia: ${pedido.referencia}</p>
        <p>Cliente: ${datosCliente.nombre} ${datosCliente.apellido}</p>
        <p>Fecha: ${new Date(pedido.fecha).toLocaleString()}</p>
        <p>Dirección: ${pedido.direccion}</p>
      </div>
      <div class="details">
        <table>
          <thead>
            <tr><th>Libro</th><th>Cantidad</th><th>Precio</th></tr>
          </thead>
          <tbody>
            ${detalles.map((linea: any) => `
              <tr>
                <td>${linea.titulo}</td>
                <td>${linea.cantidad}</td>
                <td>${linea.precio} €</td>
              </tr>
            `).join('')}
            <tr>
              <td class="total-label" colspan="2">Gastos Envío:</td>
              <td class="total-value">${pedido.total < 5 ? 5 : 0} €</td>
            </tr>
            <tr>
              <td class="total-label" colspan="2">Total:</td>
              <td class="total-value">${pedido.total} €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer">
        <p>Para consultas: <a href="mailto:contacto.tinteka@gmail.com">contacto.tinteka@gmail.com</a></p>
      </div>
    </div>
  `;

    // Configuración común
    div.style.width = '190mm';
    div.style.margin = '0 auto';

    // Estilos condicionales
    const styles = document.createElement('style');
    styles.innerHTML = isMistery ? `
    body { font-family: 'Arial', sans-serif; background: #f4f4f9; padding: 20px; }
    .container { max-width: 600px; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); margin-left: auto;
    margin-right: auto;box-sizing: border-box; }
    .header { text-align: center; margin-bottom: 25px; }
    .header img { height: 50px; margin: 0 auto 20px; display: block; }
    .header h1 { font-size: 24px; color: #232323; font-weight: bold; }
    .header h2 { font-size: 20px; color: #555; margin: 5px 0; }
    .details { margin: 25px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0; }
    .details p { font-size: 16px; color: #444; margin: 10px 0; }
    .footer { text-align: center; font-size: 14px; color: #666; margin-top: 25px; }
    .footer a { color: #007BFF; text-decoration: none; font-weight: 500; }
  ` : `
    body { font-family: 'Work Sans', sans-serif; background: #f0f0e8; padding: 20px; }
    .container { max-width: 600px; background: #fffffe; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-left: auto;
    margin-right: auto; box-sizing: border-box;}
    .header { text-align: center; }
    .header img { height: 50px; margin: 0 auto 20px; display: block; }
    .header h1 { font-size: 24px; color: #232323; font-weight: bold; }
    .details { margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #ddd; }
    th { background: #f4f4f4; }
    .total-label { text-align: right; font-weight: bold; width: 80%; border: none; }
    .total-value { font-weight: bold; width: 20%; border: none; }
    .footer { text-align: center; font-size: 14px; color: #222525; }
    .footer a { color: #007BFF; text-decoration: none; }
  `;

    div.appendChild(styles);
    document.body.appendChild(div);

    // Generación del PDF
    // Generación del PDF
    html2canvas(div, {
      scale: 2,
      windowWidth: 190 * 3.78,
      useCORS: true
    }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20; // Ancho de contenido con márgenes
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Calcular posición horizontal centrada
      const horizontalPosition = (pageWidth - imgWidth) / 2;

      let currentHeight = 10;
      if (currentHeight + imgHeight > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        currentHeight = 10;
      }

      // Aplicar posición horizontal centrada
      pdf.addImage(canvas, 'PNG', horizontalPosition, currentHeight, imgWidth, imgHeight);
      pdf.save(`detalles_pedido_${pedido.referencia}.pdf`);
      document.body.removeChild(div);
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

  editarEstadoSuscripcion() {
    if (this.estadoSuscripcion) {
    this.perfilUsuarioService.putEditarEstado(this.estadoSuscripcion).subscribe({
      next: (response) => {
        console.log('Suscripción cancelada:', response);
        this.alertMessage = 'Suscripción cancelada correctamente';
        this.alertType = 'success';
        this.isAlertVisible = true;
        this.showGestionSuscripcion = false;
        this.showConfirmCancel = false;
        this.estadoSuscripcion = false;
      },
      error: (err) => {
        console.error('Error cancelando suscripción:', err);
        this.alertMessage = 'Error al cancelar la suscripción';
        this.alertType = 'warning';
        this.showConfirmCancel = false;
        this.isAlertVisible = true;
      }
    });
    } else {
      this.perfilUsuarioService.putEditarEstado(this.estadoSuscripcion).subscribe({
        next: (response) => {
          console.log('Suscripción renovada:', response);
          this.alertMessage = 'Suscripción renovada correctamente';
          this.alertType = 'success';
          this.isAlertVisible = true;
          this.showGestionSuscripcion = false;
          this.showConfirmRenew = false;
          this.estadoSuscripcion = true;

        },
        error: (err) => {
          console.log(this.estadoSuscripcion);
          console.error('Error renovando suscripción:', err);
          this.alertMessage = 'Error al renovar la suscripción';
          this.alertType = 'warning';
          this.showConfirmRenew = false;
          this.isAlertVisible = true;
        }
      });

    }
    setTimeout(() => {
      this.zone.run(() => {
        this.isAlertVisible = false;
        this.cdRef.detectChanges();
      });
    }, 5000);

  }

  cambiarGenero() {
    let genero = Number(this.generoSeleccionado) + 1;
    this.perfilUsuarioService.putEditarGenero(genero).subscribe({
      next: (response) => {
        console.log('Género cambiado:', response);
        this.alertMessage = 'Género cambiado correctamente';
        this.alertType = 'success';
        this.isAlertVisible = true;
        this.editandoGenero = false;
      },
      error: (err) => {
        console.error('Error cambiando género:', err);
        this.alertMessage = 'Error al cambiar el género';
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
  }

}
