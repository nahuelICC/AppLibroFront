import {Component, EventEmitter, Output} from '@angular/core';
import {Input} from '@angular/core';
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
        return 'px-4 py-2 text-sm';
      case 'large':
        return 'sm:w-72 py-2 text-lg';
      default:
        return 'px-6 py-2 text-base';
    }
  }



}
