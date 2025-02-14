import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CambioPasswordService} from '../services/cambio-password.service';
import {BotonComponent} from '../../../shared/components/boton/boton.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-cambio-password',
  imports: [
    ReactiveFormsModule,
    BotonComponent,
    NgIf
  ],
  templateUrl: './cambio-password.component.html',
  standalone: true,
  styleUrl: './cambio-password.component.css'
})
export class CambioPasswordComponent {
  errorMessage: string | null = null;
  isLoading = false;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  constructor(private router: Router, private cambioPasswordService:CambioPasswordService) { }

  onSubmit() {
    this.cambioPasswordService.solicitarCambioPassword(this.form.value.email).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.errorMessage = err.error.message
    });
  }

}
