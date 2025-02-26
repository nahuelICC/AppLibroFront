// src/app/core/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../../core/services/auth-service.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import {NotificacionesService} from '../../../../shared/services/notificaciones.service';

/**
 * Componente para el login
 */
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
    RouterLink,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  apiUrl = '/api/login_check';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private notificacionesService: NotificacionesService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Función para hacer login
   */
  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.http.post<{ token: string }>(this.apiUrl, this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.setToken(response.token); // Almacena el token
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/main']);
        }
        this.notificacionesService.actualizarCantidadNotificaciones();
        this.isLoading = false; // Desactiva el estado de carga
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleError(error);
      },
    });
  }

  /**
   * Función para manejar errores del login
   * @param error
   * @private
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      if (error.error.message === 'Tu cuenta no está activa.') {
        this.errorMessage = 'Tu cuenta no está activa. Revisa tu correo para activarla.';
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    } else if (error.status === 0) {
      this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a Internet.';
    } else {
      this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.';
    }
  }
}
