import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthServiceService} from '../../../../core/services/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgIf,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  apiUrl = '/api/usuario/login';
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post<{ token: string }>(this.apiUrl, this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/main']);
        },
        error: (error) => {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          console.error(error);
        },
      });
    }
  }
}
