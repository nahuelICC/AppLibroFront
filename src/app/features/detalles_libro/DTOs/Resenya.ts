export class Resenya {
  id: number;
  id_cliente: number;
  id_libro: number;
  texto: string;
  valoracion: number;
  nombre: string;
  apellido: string;

  constructor(
    id: number,
    id_cliente: number,
    id_libro: number,
    texto: string,
    valoracion: number,
    nombre: string,
    apellido: string
  ) {
    this.id = id;
    this.id_cliente = id_cliente;
    this.id_libro = id_libro;
    this.texto = texto;
    this.valoracion = valoracion;
    this.nombre = nombre;
    this.apellido = apellido;
  }
}
