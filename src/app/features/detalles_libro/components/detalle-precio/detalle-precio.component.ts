import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';
import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LibroDetalle} from '../../DTOs/LibroDetalle';
import {DetallesLibroService} from '../../services/detalles-libro.service';
import {AlertInfoComponent, AlertType} from '../../../../shared/components/alert-info/alert-info.component';

@Component({
  selector: 'app-detalle-precio',
  imports: [
    BotonComponent,
    MatIcon,
    NgForOf,
    AlertInfoComponent
  ],
  templateUrl: './detalle-precio.component.html',
  standalone: true,
  styleUrl: './detalle-precio.component.css'
})
export class DetallePrecioComponent implements OnChanges, OnInit {
  @Input() precios: { blanda: number | null, dura: number | null } = { blanda: null, dura: null };
  @Input() tiposTapa: any[] = [];
  @Input() libroId: number | null = null;
  @Input() libro: LibroDetalle | null = null;
  price: number = 0;
  quantity: number = 1;
  selectedTipoTapa: any = null;
  alertMessage: string = '';
  alertType: AlertType = 'success';
  isAlertVisible: boolean = false;

  constructor(private detallesLibroService: DetallesLibroService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('tiposTapa en ngOnInit:', this.tiposTapa);
    if (this.tiposTapa.length > 0) {
      this.selectedTipoTapa = this.tiposTapa[0];
      this.updatePrice(); // Actualizar el precio automáticamente
      this.cdRef.detectChanges(); // Forzar la detección de cambios
    }
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tiposTapa'] && this.tiposTapa.length > 0) {
      this.selectedTipoTapa = this.tiposTapa[0]; // Seleccionar el primer tipo de tapa
      this.updatePrice();
    }
  }


  updateQuantity(amount: number) {
    if (this.quantity + amount > 0 && this.quantity + amount <= 10) {
      this.quantity += amount;
    } else if (this.quantity + amount > 10) {
      this.quantity = 10; // Limitar la cantidad máxima a 15
    } else {
      console.warn('La cantidad no puede ser menor que 1');
    }
  }


  selectCover(tipo: any) {
    // Asigna el objeto completo del tipo de tapa al valor de selectedTipoTapa
    this.selectedTipoTapa = tipo;
    console.log('Tipo de tapa seleccionado:', this.selectedTipoTapa);

    // Reinicia la cantidad a 1 cuando se cambia el tipo de tapa
    this.quantity = 1;

    // Luego puedes llamar a updatePrice o cualquier otra función necesaria
    this.updatePrice();
  }




  updatePrice() {
    if (this.selectedTipoTapa && this.selectedTipoTapa.id_tipo_tapa && this.libroId) {
      console.log('Enviando al backend:', this.libroId, this.selectedTipoTapa.id_tipo_tapa);
      this.detallesLibroService.getPrecioTapa(this.libroId, this.selectedTipoTapa.id_tipo_tapa).subscribe(
        (data) => {
          console.log('Precio recibido:', data);
          this.price = data.precio;  // Actualiza el precio en tu interfaz

          // Asegúrate de actualizar el id_tipo en selectedTipoTapa
          this.selectedTipoTapa.id_tipo = data.id_tipo; // Asigna el id_tipo de la respuesta
        },
        (error) => {
          console.error('Error al obtener el precio:', error);
        }
      );
    } else {
      console.error('selectedTipoTapa o libroId no definidos');
    }
  }



    // Nueva propiedad para el tipo de alerta


  anadirAlCarrito() {
    if (!this.libroId || !this.selectedTipoTapa || !this.selectedTipoTapa.id_tipo) {
      console.error('Datos incompletos para agregar al carrito');
      return;
    }

    const cartItem = {
      id_tipo: this.selectedTipoTapa.id_tipo,
      cantidad: this.quantity
    };

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingItem = cart.find((item: any) => item.id_tipo === cartItem.id_tipo);

    if (existingItem) {
      const newQuantity = existingItem.cantidad + cartItem.cantidad;

      if (newQuantity > 10) {
        this.alertMessage = 'No se puede añadir más de 10 unidades del mismo libro.';
        this.alertType = 'warning';  // Tipo de alerta 'error'
        this.isAlertVisible = true;

        setTimeout(() => {
          this.isAlertVisible = false;
        }, 2000);

        return;
      } else {
        existingItem.cantidad = newQuantity;

        this.alertMessage = 'Libro añadido al carrito correctamente';
        this.alertType = 'success';  // Tipo de alerta 'success'
      }
    } else {
      cart.push(cartItem);

      this.alertMessage = 'Libro añadido al carrito correctamente';
      this.alertType = 'success';  // Tipo de alerta 'success'
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    setTimeout(() => {
      this.isAlertVisible = false;
    }, 2000);
  }




}
