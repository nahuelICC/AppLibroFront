import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

@Component({
  selector: 'app-boton',
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './boton.component.html',
  standalone: true,
  styleUrl: './boton.component.css'
})
export class BotonComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() label: string = 'Button';
  @Input() color: string = '#078080';

  getSizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'px-4 py-2 text-sm md:w-48 sm:w-30';
      case 'large':
        return 'sm:w-72 py-2 px-3 text-lg';
      default:
        return 'px-6 py-2 text-base';
    }
  }



}
