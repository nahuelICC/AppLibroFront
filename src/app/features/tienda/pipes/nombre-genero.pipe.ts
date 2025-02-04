import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'nombreGenero'
})
export class NombreGeneroPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Paso 1: Reemplazar underscores y splitear
    const words = value
      .replace(/_/g, ' ') // Convertir underscores a espacios
      .split(' ');

    // Paso 2: Capitalizar cada palabra
    return words
      .map(word =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
      )
      .join(' ');
  }
}
