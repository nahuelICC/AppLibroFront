import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'filtroBuscador'
})
export class FiltroBuscadorPipe implements PipeTransform {

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
