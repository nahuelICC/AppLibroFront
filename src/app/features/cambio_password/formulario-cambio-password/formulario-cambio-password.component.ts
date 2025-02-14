import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CambioPasswordService} from '../services/cambio-password.service';
import {BotonComponent} from '../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-formulario-cambio-password',
  imports: [
    ReactiveFormsModule,
    NgIf,
    BotonComponent
  ],
  templateUrl: './formulario-cambio-password.component.html',
  standalone: true,
  styleUrl: './formulario-cambio-password.component.css'
})
export class FormularioCambioPasswordComponent implements OnInit {
  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  });
  token: string | null = null;
  tokenValid = false;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private cambioPasswordService: CambioPasswordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log(this.token);
    if (this.token) {
      this.cambioPasswordService.validaToken(this.token).subscribe({
        next: (res) => this.tokenValid = res.valid,
        error: () => this.tokenValid = false
      });
    }
  }

  onSubmit() {
    if (this.form.valid && this.token) {
      this.cambioPasswordService.resetPassword(
        this.token,
        this.form.value.password,
        this.form.value.confirmPassword
      ).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => alert('Error: ' + err.error.error)
      });
    }
  }

}
