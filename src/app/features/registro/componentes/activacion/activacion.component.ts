import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-activacion',
  templateUrl: './activacion.component.html',
  imports: [BotonComponent, NgClass],
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
      this.http.get<{ message: string }>(`/api/clientes/activar/${token}`)
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

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
