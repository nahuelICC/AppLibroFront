import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CambioPasswordService} from '../services/cambio-password.service';
import {BotonComponent} from '../../../shared/components/boton/boton.component';
import {NgIf} from '@angular/common';
import {AlertConfirmarComponent} from "../../../shared/components/alert-confirmar/alert-confirmar.component";
import {AlertInfoComponent, AlertType} from "../../../shared/components/alert-info/alert-info.component";

@Component({
  selector: 'app-cambio-password',
  imports: [
    ReactiveFormsModule,
    BotonComponent,
    NgIf,
    AlertConfirmarComponent,
    AlertInfoComponent
  ],
  templateUrl: './cambio-password.component.html',
  standalone: true,
  styleUrl: './cambio-password.component.css'
})
export class CambioPasswordComponent {
  errorMessage: string | null = null;
  isLoading = false;
  showAlertConfirmar = false;
  alertMessage = 'Revisa tu correo para cambiar tu contraseña';
  isAlertVisible = false;
  alertType: AlertType = 'warning';
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  constructor(private router: Router, private cambioPasswordService:CambioPasswordService) { }

  onSubmit() {
    this.cambioPasswordService.solicitarCambioPassword(this.form.value.email).subscribe({
      next: () => this.showAlertConfirmar = true,
      error: (err) => {
        this.alertMessage = err.error.message;
        this.isAlertVisible = true;
      }
    });
  }

  onConfirm() {
    this.showAlertConfirmar = false;
    this.router.navigate(['/login']);
  }

}
