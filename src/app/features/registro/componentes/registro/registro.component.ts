import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';

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
    MatSnackBarModule,
    BotonComponent,
  ],
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  apiUrl = '/api/clientes/registro';
  errorMessage: string | null = null;
  isLoading = false;
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      apellido: ['', [Validators.required, Validators.pattern(/\S+/)]],
      direccion: ['', [Validators.required, Validators.pattern(/\S+/)]],
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
        (this.registroForm.get('direccion')?.valid ?? false) &&
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
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
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
    this.errorMessage = null;

    const { confirmPassword, ...formData } = this.registroForm.value;

    this.http.post(this.apiUrl, formData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.isLoading = false;

        this.snackBar.open('Registro con éxito, revisa tu correo para validar tu cuenta', 'Cerrar', { duration: 5000 });
        this.router.navigate(['/main']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al registrar el usuario:', error);

        if (error.status === 409) {
          console.warn("Ignorando error 409, el usuario ya ha sido registrado correctamente.");
          return;
        }

        this.handleError(error);

        this.snackBar.open(this.errorMessage ?? 'Ocurrió un error inesperado.', 'Cerrar', {
          duration: 5000,
        });

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

    this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
  }
}
