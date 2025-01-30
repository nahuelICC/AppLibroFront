import { Component, OnInit } from '@angular/core';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-pagina-usuario',
  imports: [
    BotonComponent,
    MatIcon,
    NgIf,
    DatePipe,
    NgForOf,
    CurrencyPipe
  ],
  templateUrl: './pagina-usuario.component.html',
  standalone: true,
  styleUrl: './pagina-usuario.component.css'
})
export class PaginaUsuarioComponent implements OnInit {
  pedidosAbiertos: { [key: number]: boolean } = {};
  pedidosCargados: { [key: number]: boolean } = {};
  datosCliente: any = { pedidos: [] };

  constructor(private perfilUsuarioService: PerfilUsuarioService) { }

  ngOnInit(): void {
    this.cargarDatosCliente();
  }

  private cargarDatosCliente(): void {
    this.perfilUsuarioService.getDatosCliente().subscribe({
      next: (data) => {
        this.datosCliente = data;
        if (this.datosCliente.pedidos) {
          this.datosCliente.pedidos.forEach((pedido: any) => {
            this.pedidosAbiertos[pedido.id] = false;
            this.pedidosCargados[pedido.id] = false;
          });
        }
      },
      error: (err) => console.error('Error cargando datos:', err)
    });
  }

  toggleDropdown(pedido: any): void {
    const pedidoId = pedido.id;

    if (!this.pedidosCargados[pedidoId]) {
      this.cargarDetallesPedido(pedidoId);
      this.pedidosCargados[pedidoId] = true;
    }

    this.pedidosAbiertos[pedidoId] = !this.pedidosAbiertos[pedidoId];
  }

  private cargarDetallesPedido(pedidoId: number): void {
    this.perfilUsuarioService.getDetallesPedido(pedidoId).subscribe({
      next: (detalles) => {
        const pedidoIndex = this.datosCliente.pedidos.findIndex((p: any) => p.id === pedidoId);
        if (pedidoIndex > -1) {
          this.datosCliente.pedidos[pedidoIndex].detalles = detalles;
          console.log('Detalles cargados:', detalles);
        }
      },
      error: (err) => console.error('Error cargando detalles:', err)
    });
  }

  calcularTotalPedido(pedido: any): number {
    return pedido.detalles.reduce((total: number, producto: any) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }
}
