import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgForOf, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AlertConfirmarComponent } from '../../../../shared/components/alert-confirmar/alert-confirmar.component';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { AlertType } from '../../../../shared/components/alert-info/alert-info.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    BotonComponent,
    NgForOf,
    AlertConfirmarComponent,
  ],
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  apiUrl = '/api/clientes/registro';
  errorMessage: string | null = null;
  isLoading = false;
  currentStep = 1;
  showAlertConfirmar = false;
  alertMessage = 'Registro con éxito, revisa tu correo para validar tu cuenta';
  isRegistrationSuccessful = false;

  provincias: string[] = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8) , Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      apellido: ['', [Validators.required, Validators.pattern(/\S+/)]],
      direccionCompleta: ['', [Validators.required, Validators.pattern(/\S+/)]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      localidad: ['', [Validators.required, Validators.pattern(/\S+/)]],
      provincia: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      return (this.registroForm.get('nombre')?.valid ?? false) &&
        (this.registroForm.get('apellido')?.valid ?? false) &&
        (this.registroForm.get('direccionCompleta')?.valid ?? false) &&
        (this.registroForm.get('codigoPostal')?.valid ?? false) &&
        (this.registroForm.get('localidad')?.valid ?? false) &&
        (this.registroForm.get('provincia')?.valid ?? false) &&
        (this.registroForm.get('telefono')?.valid ?? false);
    } else if (step === 2) {
      return (this.registroForm.get('username')?.valid ?? false) &&
        (this.registroForm.get('email')?.valid ?? false) &&
        (this.registroForm.get('password')?.valid ?? false) &&
        (this.registroForm.get('confirmPassword')?.valid ?? false) &&
        !this.registroForm.hasError('mismatch');
    }
    return false;
  }

  nextStep() {
    if (this.isStepValid(this.currentStep)) {
      this.errorMessage = null; // Limpia el mensaje de error
      this.isLoading = false;
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.errorMessage = null; // Limpia el mensaje de error
      this.isLoading = false;
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.isLoading) {
      return; // Evita múltiples solicitudes simultáneas
    }

    if (this.currentStep === 1) {
      this.nextStep();
      return;
    }

    if (!this.isStepValid(this.currentStep)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null; // Limpia el mensaje de error
    this.isRegistrationSuccessful = false; // Reinicia el estado de éxito

    const { confirmPassword, direccionCompleta, codigoPostal, localidad, provincia, ...formData } = this.registroForm.value;
    formData.direccion = `${direccionCompleta}, ${codigoPostal}, ${localidad}, ${provincia}`;

    this.http.post(this.apiUrl, formData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.isLoading = false;
        this.isRegistrationSuccessful = true;
        this.showAlertConfirmar = true;
        this.alertMessage = 'Registro con éxito, revisa tu correo para validar tu cuenta'; // Asegúrate de que el mensaje de éxito esté actualizado
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al registrar el usuario:', error);

        if (error.status === 409) {
          if (error.error.message.includes('correo electrónico')) {
            this.errorMessage = 'El correo electrónico ya está en uso.';
          } else if (error.error.message.includes('nombre de usuario')) {
            this.errorMessage = 'El nombre de usuario ya está registrado.';
          }
          this.isLoading = false;
          this.showAlert(this.errorMessage ?? 'Ocurrió un error inesperado.', 'error');
          return;
        }

        this.handleError(error);
        this.showAlert(this.errorMessage ?? 'Ocurrió un error inesperado.', 'error');
        this.isLoading = false;
      },
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Error en el servidor:', error);

    if (error.status === 400) {
      this.errorMessage = 'Datos inválidos. Por favor, revisa el formulario.';
    } else if (error.status === 0) {
      this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a Internet.';
    } else {
      this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.';
    }
  }

  private showAlert(message: string, type: AlertType) {
    this.alertMessage = message;
    this.showAlertConfirmar = true;
  }

  onConfirm() {
    this.showAlertConfirmar = false;
    if (this.isRegistrationSuccessful) {
      this.router.navigate(['/main']);
    }
  }

  onCancel() {
    this.showAlertConfirmar = false;
  }
}
