// src/app/core/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../../core/services/auth-service.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    BotonComponent,
    // Para mostrar mensajes de error
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  apiUrl = '/api/login_check';
  errorMessage: string | null = null;
  isLoading = false; // Para manejar el estado de carga

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Valida que el campo no esté vacío
      password: ['', [Validators.required]], // Valida que la contraseña tenga al menos 6 caracteres
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
      return;
    }

    this.isLoading = true; // Activa el estado de carga
    this.errorMessage = null; // Limpia el mensaje de error anterior

    this.http.post<{ token: string }>(this.apiUrl, this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.setToken(response.token); // Almacena el token
        this.router.navigate(['/main']); // Redirige al usuario
        this.isLoading = false; // Desactiva el estado de carga
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false; // Desactiva el estado de carga
        this.handleError(error); // Maneja el error
      },
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    } else if (error.status === 0) {
      this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a Internet.';
    } else {
      this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.';
    }

    // Muestra el mensaje de error en un snackbar (opcional)
    // this.snackBar.open(this.errorMessage, 'Cerrar', {
    //   duration: 5000, // Duración del mensaje en milisegundos
    // });
  }
}
