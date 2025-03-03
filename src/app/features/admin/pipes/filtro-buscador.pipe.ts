import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe que filtra una lista de objetos por un término de búsqueda
 */
@Pipe({
  standalone: true,
  name: 'filtroBuscador'
})
export class FiltroBuscadorPipe implements PipeTransform {
  /**
   * Filtra una lista de objetos por un término de búsqueda
   * @param lista
   * @param termino
   */
  transform(lista: any[], termino: string): any[] {
    if (!termino || !lista) return lista;

    termino = termino.toLowerCase();

    return lista.filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(termino)
      )
    );
  }
}
