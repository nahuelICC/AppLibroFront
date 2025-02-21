import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotonComponent } from '../boton/boton.component';
import { CarritoService } from '../../../features/carrito/services/carrito.service';
import { Router } from '@angular/router';
import { PasarelaPagoService } from '../../services/pasarela-pago.service';
import { AlertConfirmarComponent } from '../alert-confirmar/alert-confirmar.component';
import { AlertInfoComponent, AlertType } from '../alert-info/alert-info.component';
import { DetallesLibroService } from '../../../features/detalles_libro/services/detalles-libro.service';
import {AuthServiceService} from '../../../core/services/auth-service.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pasarela-pago',
  imports: [NgIf, FormsModule, BotonComponent, AlertConfirmarComponent, AlertInfoComponent, MatProgressSpinner],
  templateUrl: './pasarela-pago.component.html',
  standalone: true,
  styleUrl: './pasarela-pago.component.css'
})
export class PasarelaPagoComponent implements OnInit {
  // Estado actual del paso
  currentStep = 1;
  cartItems: any[] = [];
  submitted = false;
  stepsValidity: boolean[] = [false, false, false];
  datos: any;
  showConfirmEdit: boolean = false;
  alertMessage: string = '';
  alertType: AlertType = 'success';
  isAlertVisible: boolean = false;
  totalBooksPrice: number = 0;
  direccion: string = '';
  esSuscripcion: boolean = false;
  idCliente: number = 0;

  genero: string | null = null;
  idTipo: string | null = null;

  // Propiedades para la alerta de confirmación
  showAlertConfirmar: boolean = false;
  alertMessageConfirmar: string = 'Gracias por su compra';

  cardNumberError: boolean = false;
  expiryError: boolean = false;
  cvvError: boolean = false;

  isLoading: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private pasarelaPagoService: PasarelaPagoService,
    private detallesLibroService: DetallesLibroService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.loadCartFromLocalStorage();

    // Verificar si es una suscripción
    const esSuscripcion = localStorage.getItem('esSuscripcion');
    const genero = localStorage.getItem('generoSeleccionado');
    const idTipo = localStorage.getItem('idTipoSuscripcion');

    if (esSuscripcion === 'true') {
      this.esSuscripcion = true;
      console.log('Es una suscripción');
    } else {
      this.esSuscripcion = false;
      console.log('No es una suscripción');
    }

    // Logs para verificar los datos de la suscripción
    console.log('Generos, Precio, y Tipo de Suscripción en localStorage:');
    console.log('generoSeleccionado:', localStorage.getItem('generoSeleccionado'));
    console.log('precioSuscripcion:', localStorage.getItem('precioSuscripcion'));
    console.log('idTipoSuscripcion:', localStorage.getItem('idTipoSuscripcion'));
    console.log('esSuscripcion:', localStorage.getItem('esSuscripcion'));

    // Obtener los datos de dirección y cliente (lo que ya tienes)
    this.pasarelaPagoService.getDireccionTelefono().subscribe({
      next: (response: any) => {
        this.datos = response;
        this.formData.phone = this.datos.telefono;
        const direccionArray = this.datos['direccion'].split(', ');
        this.formData.calle = direccionArray[0];
        this.formData.codigoPostal = direccionArray[1];
        this.formData.localidad = direccionArray[2];
        this.formData.provincia = direccionArray[3];
        console.log('Datos obtenidos:', this.datos);
      },
      error: (error: any) => {
        console.error('Error al obtener los datos:', error);
      }
    });

    this.detallesLibroService.obtenerIdCliente().subscribe({
      next: (response) => {
        this.idCliente = response.id_cliente;  // Almacenamos el id_cliente
        console.log('ID Cliente:', this.idCliente);
      },
      error: (error) => {
        console.error('Error al obtener el id_cliente:', error);
      }
    });

    // Verificar los datos de localStorage antes de crear la suscripción
    const generoStorage = localStorage.getItem('generoSeleccionado');
    const idTipoStorage = localStorage.getItem('idTipoSuscripcion');
    const esSuscripcionStorage = localStorage.getItem('esSuscripcion');

    if (generoStorage && idTipoStorage && esSuscripcionStorage === 'true') {
      // Si los datos son correctos, se asignan
      this.genero = generoStorage;
      this.idTipo = idTipoStorage;
      console.log('Datos obtenidos del localStorage para suscripción:', this.genero, this.idTipo);
    } else {
      console.log('Faltan datos en localStorage para crear la suscripción.');
    }

    // Forzar la actualización de la vista para evitar el error ExpressionChangedAfterItHasBeenCheckedError
    this.cdRef.detectChanges();
  }

  formData = {
    calle: '',
    codigoPostal: '',
    localidad: '',
    provincia: '',
    step5: '',
    step6: '',
    step7: '',
    cardholder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paypalEmail: '',
    paypalPassword: '',
    phone: ''
  };

  // Método seleccionado
  selectedPaymentMethod: string | null = null;

  // Función para avanzar al siguiente paso
  nextStep() {
    if (!this.isCurrentStepValid()) return;

    this.submitted = false;
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  // Función para retroceder al paso anterior
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Función para guardar los datos del formulario
  saveData(step: keyof typeof this.formData, value: any) {
    this.formData[step] = value;
  }

  // Función para seleccionar un método de pago
  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method; // Guarda el método seleccionado
    this.nextStep(); // Avanza al siguiente paso
  }

  loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        this.cartItems = JSON.parse(cartData);
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    } else {
      console.warn('El carrito está vacío.');
    }
  }

  sendOrderToBackend() {
    this.isLoading = true;
    if (this.cartItems.length === 0) {
      this.showConfirmEdit = false;
      this.isLoading = false;
      this.alertMessage = 'No hay productos en el carrito.';
      this.alertType = 'warning';
      this.isAlertVisible = true;
      return;
    }
    this.totalBooksPrice = localStorage.getItem('total') ? parseFloat(localStorage.getItem('total') as string) : 0;
    this.direccion = `${this.formData.calle}, ${this.formData.codigoPostal}, ${this.formData.localidad}, ${this.formData.provincia}`;
    // total: this.totalBooksPrice + this.shippingCost - this.discount

    this.carritoService.postPedido(this.cartItems, this.totalBooksPrice, this.direccion).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.showConfirmEdit = false;
        this.clearCart();
        this.showAlertConfirmar = true; // Mostrar la alerta de confirmación
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error al enviar el pedido:', error);
        this.showConfirmEdit = false;
        this.alertMessage = 'Error al enviar el pedido.';
        this.alertType = 'warning';
        this.isAlertVisible = true;
      }
    });
  }

  clearCart() {
    this.cartItems = [];
    this.carritoService.clearCart();
    localStorage.removeItem('cart');
    localStorage.removeItem('total');
  }

  isCurrentStepValid(): boolean {
    this.submitted = true;

    switch (this.currentStep) {
      case 1:
        return !!this.formData.calle && !!this.formData.codigoPostal &&
          !!this.formData.localidad && !!this.formData.provincia;

      case 3:
        if (this.selectedPaymentMethod === 'credit-card') {
          const isValid = /^(\d{4})\s(\d{4})\s(\d{4})\s(\d{4})$/.test(this.formData.cardNumber) &&
            /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(this.formData.expiry) &&
            /^\d{3,4}$/.test(this.formData.cvv) &&
            !!this.formData.cardholder;

          // Actualizar estados de error
          this.cardNumberError = !/^\d{13,19}$/.test(this.formData.cardNumber);
          this.expiryError = !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(this.formData.expiry);
          this.cvvError = !/^\d{3,4}$/.test(this.formData.cvv);

          return isValid;
        }
        if (this.selectedPaymentMethod === 'paypal') {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.formData.paypalEmail) &&
            !!this.formData.paypalPassword;
        }
        if (this.selectedPaymentMethod === 'other') {
          return /^[0-9]{9,12}$/.test(this.formData.phone);
        }
        return false;

      default:
        return true;
    }
  }

  onFinalizar() {
    if (this.esSuscripcion) {
      // Si es suscripción, llamamos al servicio para crear la suscripción
      this.crear();
    } else {
      // Si no es suscripción, simplemente completamos el pedido
      this.sendOrderToBackend();
    }
  }

  crear() {
    this.isLoading = true;
    if (this.genero && this.idTipo) {
      const tipoSuscripcion = parseInt(this.idTipo, 10);
      const direccion = `${this.formData.calle}, ${this.formData.codigoPostal}, ${this.formData.localidad}, ${this.formData.provincia}`;

      const data = {
        genero: parseInt(this.genero, 10),
        direccion: direccion
      };

      console.log('Enviando datos de suscripción:', { idCliente: this.idCliente, tipoSuscripcion, data });

      this.pasarelaPagoService.crearSuscripcion(this.idCliente, tipoSuscripcion, data)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Suscripción creada con éxito:', response);
            this.isAlertVisible = true;
            this.alertMessage = 'Suscripción contratada';
            this.alertType = 'success';
            // Limpiar datos de localStorage después de la suscripción
            localStorage.removeItem('generoSeleccionado');
            localStorage.removeItem('idTipoSuscripcion');
            localStorage.removeItem('esSuscripcion');
            localStorage.removeItem('precioSuscripcion');
            this.showAlertConfirmar = true; // Mostrar la alerta de confirmación
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error al crear la suscripción:', error);

            if (error.status === 400) {
              this.isLoading = false;
              this.alertMessage = 'Ya tiene una suscripción activa';
              this.alertType = 'warning';
              localStorage.removeItem('generoSeleccionado');
              localStorage.removeItem('idTipoSuscripcion');
              localStorage.removeItem('esSuscripcion');
              localStorage.removeItem('precioSuscripcion');
            } else {
              this.alertMessage = 'Error al procesar la suscripción';
              this.alertType = 'error';
            }

            this.isAlertVisible = true;
          }
        });
    } else {
      this.isLoading = false;
      console.error('Faltan datos en localStorage para crear la suscripción.');
    }
  }

  onConfirm() {
    this.showAlertConfirmar = false;
    this.router.navigate(['/main']);
    this.authService.refreshLocalStorage();
  }

  onCancel() {
    this.showAlertConfirmar = false;
  }

  formatCardNumber() {

    this.formData.cardNumber = this.formData.cardNumber
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();

  }


// Función para formatear fecha de expiración
  formatExpiryDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    input.value = value;
    this.formData.expiry = value;

    // Validación en tiempo real
    this.expiryError = !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
  }

// Función para validar CVV
  validateCVV() {
    this.cvvError = !/^\d{3,4}$/.test(this.formData.cvv);
  }

}
