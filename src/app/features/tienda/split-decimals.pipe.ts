import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'splitPrice'
})
export class SplitPricePipe implements PipeTransform {

  /**
    * Transforma un número en una cadena de texto con dos partes.
   */
  transform(value: number, part: 'integer' | 'decimal'): string {
    if (value == null) return '';
    const [integer, decimal] = value.toFixed(2).split('.');
    return part === 'integer' ? integer : decimal;
  }
}
