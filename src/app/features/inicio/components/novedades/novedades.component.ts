import {Component, OnInit} from '@angular/core';
import {LibroServiceService} from '../../../../core/services/libro/libro-service.service';
import {Observable} from 'rxjs';
import {LibroNovedad} from '../../DTOs/LibroNovedad';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-novedades',
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './novedades.component.html',
  standalone: true,
  styleUrl: './novedades.component.css'
})
export class NovedadesComponent implements OnInit{
  novedades$!: Observable<LibroNovedad[]>;

  constructor(private libroService: LibroServiceService) {}

  ngOnInit(): void {
    this.novedades$ = this.libroService.getNovedades();
  }

}
