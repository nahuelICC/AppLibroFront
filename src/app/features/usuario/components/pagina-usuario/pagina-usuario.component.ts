import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditaUsuarioDTO } from '../../DTOs/EditaUsuarioDTO';
import { AlertConfirmarComponent } from '../../../../shared/components/alert-confirmar/alert-confirmar.component';
import { AlertInfoComponent, AlertType } from '../../../../shared/components/alert-info/alert-info.component';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router, RouterLink } from '@angular/router';
import {NombreGeneroPipe} from '../../../tienda/pipes/nombre-genero.pipe';

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
    TitleCasePipe,
    RouterLink,
    NombreGeneroPipe
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
  datosEdicion: EditaUsuarioDTO = new EditaUsuarioDTO();
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
  provincias: string[] = ['Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'];
  estadoSuscripcion: boolean = true;
  showGestionSuscripcion: boolean = false;
  showConfirmCancel: boolean = false;
  showConfirmRenew: boolean = false;
  generos: string[] = ["Novela Negra", "Thriller", "Novela Historica", "Romantica", "Ciencia Ficcion", "Distopia", "Aventuras", "Fantasia", "Contemporaneo", "Terror", "Paranormal", "Poesia", "Juvenil", "Infantil", "Autoayuda", "Salud Y Deporte", "Manuales", "Memorias", "Biografias", "Cocina", "Viajes", "Libros Tecnicos", "Referencia", "Divulgativos", "Libros De Texto", "Arte"];
  editandoGenero: boolean = false;
  generoSeleccionado: number = 0;
  renovadoTipo : any;

  constructor(private perfilUsuarioService: PerfilUsuarioService, private fb: FormBuilder, private cdRef: ChangeDetectorRef, private zone: NgZone, private router: Router) {
    this.cambioContrasenaForm = this.fb.group({
      actual: ['', Validators.required],
      nueva: ['', [
        Validators.required,
        Validators.minLength(8),
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
        this.generoSeleccionado = this.datosCliente.suscripcion.genero - 1;
        this.renovadoTipo = this.datosCliente.renovada;

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
          this.generarPDF(detalles, pedido, this.datosCliente);
        }
      },
      error: (err) => console.error('Error al descargar detalles:', err)
    });
  }

  generarPDF(detalles: any, pedido: any, datosCliente: any): void {
    const div = document.createElement('div');
    div.innerHTML = `
  <div class="container">
    <div class="header">
      <div class="image-container">
        <img src="assets/Logo.png" alt="Tinteka">
      </div>
      <h1>Factura del Pedido</h1>
      <p>Número de Factura: ${pedido.referencia}</p>
      <p>Fecha del Pedido: ${new Date(pedido.fecha).toLocaleDateString()}</p>
    </div>
    <div>
      <h3>Datos del Cliente</h3>
      <p>${datosCliente.nombre} ${datosCliente.apellido}</p>
      <p>Dirección de Envío: ${pedido.direccion}</p>
    </div>
    <div class="details">
      <h3>Detalles del Pedido</h3>
      <table>
        <thead>
          <tr>
            <th>Libro</th>
            <th>Cantidad</th>
            <th>Precio (IVA incl.)</th>
            <th>Precio (IVA excl.)</th>
            <th>IVA (4%)</th>
          </tr>
        </thead>
        <tbody>
          ${detalles.map((linea: any) => `
            <tr>
              <td>${linea.titulo}</td>
              <td>${linea.cantidad}</td>
              <td>${linea.precio} €</td>
              <td>${(linea.precio * 0.96).toFixed(2)} €</td>
              <td>${(linea.precio - (linea.precio * 0.96)).toFixed(2)} €</td>
            </tr>
          `).join('')}
          <tr>
            <td class="total" colspan="4">Gastos de Envío (IVA incl.):</td>
            <td>${pedido.total < 5 ? 5 : 0} €</td>
          </tr>
          <tr>
            <td class="total" colspan="4">Total (IVA incl.):</td>
            <td>${pedido.total} €</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3>Datos del Vendedor</h3>
      <p>Tinteka</p>
      <p>Email: <a href="mailto:contacto.tinteka@gmail.com">contacto.tinteka@gmail.com</a></p>
    </div>
    <div class="footer">
      <p>Si tienes alguna pregunta, contacta con nosotros en <a href="mailto:contacto.tinteka@gmail.com">contacto.tinteka@gmail.com</a>.</p>
    </div>
  </div>
`;

    // Estilos
    const styles = document.createElement('style');
    styles.innerHTML = `
  body {
    font-family: 'Work Sans', sans-serif;
    background-color: #f8f9fa;
    padding: 20px;
  }
  .container {
    max-width: 700px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .header {
    text-align: center;
  }
  .image-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .header img {
    height: 50px;
  }
  .header h1 {
    font-size: 22px;
    font-weight: bold;
    color: #232323;
  }
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #232323;
    margin-top: 20px;
  }
  .details table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  .details th, .details td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }
  .details th {
    background-color: #f4f4f4;
  }
  .total {
    text-align: right;
    font-weight: bold;
  }
  .footer {
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
    color: #555;
  }
  .footer a {
    color: #078080;
    text-decoration: none;
  }
`;

    div.appendChild(styles);
    document.body.appendChild(div);

    // Generación del PDF
    html2canvas(div, {
      scale: 3, // Aumentamos la calidad de renderizado
      useCORS: true,
      windowWidth: 794, // Ancho equivalente a 210mm (A4) en pixels (210mm * 3.78px/mm)
      windowHeight: div.scrollHeight * 3, // Alto proporcional
      scrollY: -window.scrollY // Elimina espacios blancos no deseados
    }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // Ancho A4 en mm
      const pageHeight = 297; // Alto A4 en mm
      const margin = 10; // Márgenes de 10mm

      // Calculamos dimensiones manteniendo relación de aspecto
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0; // Posición inicial vertical

      // Dividimos en páginas
      while (position < imgHeight) {
        if (position > 0) pdf.addPage(); // Nueva página excepto la primera

        const sectionHeight = Math.min(pageHeight - margin * 2, imgHeight - position);

        // Creamos un canvas temporal para cada sección
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = canvas.width;
        tempCanvas.height = (sectionHeight / imgHeight) * canvas.height;

        // Dibujamos la sección correspondiente
        tempCtx!.drawImage(
          canvas,
          0, (position / imgHeight) * canvas.height,
          canvas.width, tempCanvas.height,
          0, 0,
          canvas.width, tempCanvas.height
        );

        // Añadimos al PDF con márgenes
        pdf.addImage(
          tempCanvas,
          'PNG',
          margin, // Margen izquierdo
          margin, // Margen superior
          imgWidth,
          sectionHeight,
          undefined,
          'FAST'
        );

        position += sectionHeight;
      }

      pdf.save(`factura_pedido_${pedido.referencia}.pdf`);
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
      this.datosClienteOriginal = { ...this.datosCliente };
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

  cambiarSuscripcion() {
    if (this.renovadoTipo !== ""){
      this.router.navigate(['/infocajas', this.renovadoTipo]).then(r => {
        localStorage.setItem('change', String(true));
      });
    }
    this.router.navigate(['/infocajas', this.datosCliente.suscripcion.tipoSuscripcion]).then(r => {
      localStorage.setItem('change', String(true));
    });
  }

  showConfirmCancelPedidoId: number | null = null;

  showConfirmCancelPedido(pedidoId: number): void {
    this.showConfirmCancelPedidoId = pedidoId;
  }

  cancelarPedido(pedidoId: number): void {
    this.perfilUsuarioService.cancelarPedido(pedidoId).subscribe({
      next: (response) => {
        console.log('Pedido cancelado:', response);
        this.alertMessage = 'Pedido cancelado correctamente';
        this.alertType = 'success';
        this.isAlertVisible = true;
        // Actualiza la lista de pedidos
        this.datosCliente.pedidos = this.datosCliente.pedidos.filter((pedido: any) => pedido.id !== pedidoId);
      },
      error: (err) => {
        console.error('Error cancelando pedido:', err);
        this.alertMessage = 'Error al cancelar el pedido';
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
