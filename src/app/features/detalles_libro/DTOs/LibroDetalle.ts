export class LibroDetalle {
  titulo: string;
  autor: string;
  portada: string;
  genero: string;
  descripcion: string;
  precioTapaBlanda: string;
  precioTapaDura: string;

  constructor(titulo: string, autor: string, portada: string, genero: string, descripcion: string,precioTapaBlanda: string,precioTapaDura: string) {
    this.titulo = titulo;
    this.autor = autor;
    this.portada = portada;
    this.genero = genero;
    this.descripcion = descripcion;
    this.precioTapaBlanda = precioTapaBlanda;
    this.precioTapaDura= precioTapaDura;
  }
}
