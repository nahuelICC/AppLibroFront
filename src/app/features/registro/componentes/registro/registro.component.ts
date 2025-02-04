import { Component } from '@angular/core';
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
export class RegistroComponent {
  registroForm: FormGroup;
  apiUrl = '/api/clientes/registro';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { confirmPassword, ...formData } = this.registroForm.value;

    this.http.post(this.apiUrl, formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleError(error);
      },
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.errorMessage = 'Datos inválidos. Por favor, revisa el formulario.';
    } else if (error.status === 0) {
      this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a Internet.';
    } else {
      this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.';
    }

    this.snackBar.open(this.errorMessage, 'Cerrar', {
      duration: 5000,
    });
  }
}
