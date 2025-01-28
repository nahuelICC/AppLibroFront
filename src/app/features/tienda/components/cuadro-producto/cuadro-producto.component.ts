import {Component, Input} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {SplitPricePipe} from '../../split-decimals.pipe';

@Component({
  selector: 'app-cuadro-producto',
  imports: [
    NgForOf,
    NgIf,
    CurrencyPipe,
    NgOptimizedImage,
    SplitPricePipe
  ],
  templateUrl: './cuadro-producto.component.html',
  standalone: true,
  styleUrl: './cuadro-producto.component.css'
})
export class CuadroProductoComponent {
  @Input() bookCover: string = '';
  @Input() title: string = '';
  @Input() author: string = '';
  @Input() price: number = 0;
  @Input() rating: number = 0
  @Input() genre: string = '';

}
