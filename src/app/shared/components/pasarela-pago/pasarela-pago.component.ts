import {ChangeDetectorRef, Component, OnInit, Output} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotonComponent } from '../boton/boton.component';
import {CarritoService} from '../../../features/carrito/services/carrito.service';
import {Router} from '@angular/router';
import {PasarelaPagoService} from '../../services/pasarela-pago.service';
import {AlertConfirmarComponent} from '../alert-confirmar/alert-confirmar.component';
import {AlertInfoComponent, AlertType} from '../alert-info/alert-info.component';
import {DetallesLibroService} from '../../../features/detalles_libro/services/detalles-libro.service';


@Component({
  selector: 'app-pasarela-pago',
  imports: [NgIf, FormsModule, BotonComponent, AlertConfirmarComponent, AlertInfoComponent],
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


  constructor( private carritoService: CarritoService,private router:Router, private pasarelaPagoService: PasarelaPagoService,  private detallesLibroService: DetallesLibroService, private cdRef: ChangeDetectorRef) {
  }

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
    if (this.cartItems.length === 0) {
      this.showConfirmEdit = false;
      this.alertMessage = 'No hay productos en el carrito.';
      this.alertType = 'warning';
      this.isAlertVisible = true;
      return;
    }
    this.totalBooksPrice = localStorage.getItem('total') ? parseFloat(localStorage.getItem('total') as string) : 0;
    this.direccion = `${this.formData.calle}, ${this.formData.codigoPostal}, ${this.formData.localidad}, ${this.formData.provincia}`;
    // total: this.totalBooksPrice + this.shippingCost - this.discount

    this.carritoService.postPedido(this.cartItems,this.totalBooksPrice,this.direccion).subscribe({
      next: (response: any) => {
        this.showConfirmEdit = false;
        this.clearCart();
        this.router.navigate(['usuario']);
      },
      error: (error: any) => {
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

    switch(this.currentStep) {
      case 1:
        return !!this.formData.calle && !!this.formData.codigoPostal &&
          !!this.formData.localidad && !!this.formData.provincia;

      case 3:
        if(this.selectedPaymentMethod === 'credit-card') {
          return /^\d{13,19}$/.test(this.formData.cardNumber) &&
            /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(this.formData.expiry) &&
            /^\d{3,4}$/.test(this.formData.cvv) &&
            !!this.formData.cardholder;
        }
        if(this.selectedPaymentMethod === 'paypal') {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.formData.paypalEmail) &&
            !!this.formData.paypalPassword;
        }
        if(this.selectedPaymentMethod === 'other') {
          return /^[0-9]{9,12}$/.test(this.formData.phone);
        }
        return false;

      default:
        return true;
    }
  }

  nextStep() {
    if (!this.isCurrentStepValid()) return;

    this.submitted = false;
    if (this.currentStep < 4) {
      this.currentStep++;
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
    if (this.genero && this.idTipo) {
      const tipoSuscripcion = parseInt(this.idTipo, 10);

      // Construimos la dirección con los datos del formulario
      const direccion = `${this.formData.calle}, ${this.formData.codigoPostal}, ${this.formData.localidad}, ${this.formData.provincia}`;

      // Creamos el objeto de datos a enviar
      const data = {
        genero: parseInt(this.genero, 10),
        direccion: direccion  // Añadimos la dirección a los datos
      };

      console.log('Enviando datos de suscripción:', { idCliente: this.idCliente, tipoSuscripcion, data });

      // Llamar al servicio para crear la suscripción
      this.pasarelaPagoService.crearSuscripcion(this.idCliente, tipoSuscripcion, data)
        .subscribe(response => {
          console.log('Suscripción creada con éxito:', response);

          // Borrar los datos de suscripción de localStorage después de crear la suscripción
          localStorage.removeItem('generoSeleccionado');
          localStorage.removeItem('idTipoSuscripcion');
          localStorage.removeItem('esSuscripcion');
          localStorage.removeItem('precioSuscripcion');  // Si quieres borrar también el precio

          // Aquí puedes agregar la lógica de lo que debe suceder cuando la suscripción se haya creado correctamente
          this.router.navigate(['usuario']);  // Navegar a otra página si es necesario
        }, error => {
          console.error('Error al crear la suscripción:', error);
          // Lógica para manejar errores en la creación de suscripción
        });
    } else {
      console.error('Faltan datos en localStorage para crear la suscripción.');
    }
  }




}
