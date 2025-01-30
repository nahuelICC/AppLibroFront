import {Component, Input, OnInit} from '@angular/core';
import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {MatIcon} from '@angular/material/icon';
import {PerfilUsuarioService} from '../../services/perfil-usuario.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-pagina-usuario',
  imports: [
    BotonComponent,
    MatIcon,
    NgIf,
    DatePipe,
    NgForOf
  ],
  templateUrl: './pagina-usuario.component.html',
  standalone: true,
  styleUrl: './pagina-usuario.component.css'
})
export class PaginaUsuarioComponent implements OnInit {

  isOpen: boolean = false;
  datosCliente: any;

  constructor(private perfilUsuarioService: PerfilUsuarioService) { }

  ngOnInit(): void {
    this.perfilUsuarioService.getDatosCliente().subscribe((data: any) => {
      console.log(data);
      this.datosCliente = data;
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

}
