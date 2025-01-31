import {Component, OnInit} from '@angular/core';
import { FiltroComponent } from '../../components/filtro/filtro.component';
import { CuadroProductoComponent } from '../../components/cuadro-producto/cuadro-producto.component';
import { CuadroProducto } from '../../DTOs/CuadroProducto';
import {LibroServiceService} from '../../../../core/services/libro/libro-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-tienda',
  imports: [FiltroComponent, CuadroProductoComponent, NgForOf, NgIf, MatIcon, RouterLink],
  templateUrl: './tienda.component.html',
  standalone: true,
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit {
  principal: CuadroProducto[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  displayedPages: (number | string)[] = [];

  constructor(private libroService: LibroServiceService) {}

  ngOnInit(): void {
    this.libroService.getPrincipal().subscribe((data) => {
      this.principal = data;
      console.log(data);
      this.totalPages = Math.ceil(data.length / this.itemsPerPage);
      this.updateDisplayedPages();
    });
  }

  get paginatedItems(): CuadroProducto[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.principal.slice(start, start + this.itemsPerPage);
  }

  updateDisplayedPages() {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; // Número de páginas a mostrar alrededor de la actual

    // Calcular rango de páginas
    let start = Math.max(2, current - delta);
    let end = Math.min(total - 1, current + delta);

    // Ajustar rango si estamos cerca de los extremos
    if (current - delta < 2) end = Math.min(total - 1, 2 + delta * 2);
    if (current + delta > total - 1) start = Math.max(2, total - 1 - delta * 2);

    pages.push(1);

    // Agregar puntos suspensivos izquierdos si es necesario
    if (start > 2) pages.push('...');

    // Agregar páginas centrales
    for (let i = start; i <= end; i++) pages.push(i);

    // Agregar puntos suspensivos derechos si es necesario
    if (end < total - 1) pages.push('...');

    // Agregar última página solo si hay más de 1
    if (total > 1) pages.push(total);

    this.displayedPages = pages;
  }

  setPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.updateDisplayedPages();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPages();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedPages();
    }
  }
}
