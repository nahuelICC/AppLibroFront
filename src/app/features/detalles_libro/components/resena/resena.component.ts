import {Component, Input} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-resena',
  imports: [
    NgForOf
  ],
  templateUrl: './resena.component.html',
  standalone: true,
  styleUrl: './resena.component.css'
})
export class ResenaComponent {
  @Input() nombre: string = '';
  @Input() apellido: string = '';
  @Input() date: string = '';
  @Input() rating: number = 5;
  @Input() comment: string = '';

}
