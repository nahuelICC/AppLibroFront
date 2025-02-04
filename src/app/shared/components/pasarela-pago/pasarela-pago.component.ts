import {Component, OnInit} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotonComponent } from '../boton/boton.component';
import {CarritoService} from '../../../features/carrito/services/carrito.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-pasarela-pago',
  imports: [NgIf, FormsModule, BotonComponent],
  templateUrl: './pasarela-pago.component.html',
  standalone: true,
  styleUrl: './pasarela-pago.component.css'
})
export class PasarelaPagoComponent implements OnInit {
  // Estado actual del paso
  currentStep = 1;
  cartItems: any[] = [];

  constructor( private carritoService: CarritoService,private router:Router) {
  }

  ngOnInit(): void {
    this.loadCartFromLocalStorage();
  }

  // Datos ficticios para cada paso
  formData = {
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    step5: '',
    step6: '',
    step7: ''
  };

  // Método seleccionado
  selectedPaymentMethod: string | null = null;

  // Función para avanzar al siguiente paso
  nextStep() {
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
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío. No se puede generar un pedido.');
      return;
    }


    // total: this.totalBooksPrice + this.shippingCost - this.discount

    this.carritoService.postPedido(this.cartItems).subscribe({
      next: (response: any) => {
        alert('Pedido generado con éxito.');
        this.clearCart();
        this.router.navigate(['usuario']);
      },
      error: (error: any) => {
        console.error('Error al enviar el pedido:', error);
        alert('Ocurrió un error al enviar el pedido. Por favor, inténtalo de nuevo.');
      }
    });
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('cart');
  }


}
