import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotonComponent } from '../boton/boton.component';


@Component({
  selector: 'app-pasarela-pago',
  imports: [NgIf, FormsModule, BotonComponent],
  templateUrl: './pasarela-pago.component.html',
  standalone: true,
  styleUrl: './pasarela-pago.component.css'
})
export class PasarelaPagoComponent {
  // Estado actual del paso
  currentStep = 1;

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

  // Función para mostrar una alerta cuando se complete el proceso
  finishProcess() {
    alert('Proceso completado!');
    console.log('Datos finales:', this.formData);
  }
}
