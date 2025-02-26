import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import {NgClass} from '@angular/common';

/**
 * Componente para la activación de la cuenta
 */
@Component({
  selector: 'app-activacion',
  templateUrl: './activacion.component.html',
  imports: [BotonComponent, NgClass],
  standalone: true,
  styleUrls: ['./activacion.component.css']
})
export class ActivacionComponent implements OnInit {
  message: string = '';
  isError: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.http.get<{ message: string }>(`https://applibro.onrender.com/api/clientes/activar/${token}`)
        .subscribe(response => {
          this.message = response.message;
          this.isError = false;
        }, error => {
          this.message = 'Error al activar la cuenta.';
          this.isError = true;
        });
    } else {
      this.message = 'Token no válido.';
      this.isError = true;
    }
  }

  /**
   * Función para redirigir al login
   */
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
