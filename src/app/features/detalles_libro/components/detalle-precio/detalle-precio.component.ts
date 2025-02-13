import {BotonComponent} from '../../../../shared/components/boton/boton.component';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';
import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LibroDetalle} from '../../DTOs/LibroDetalle';
import {DetallesLibroService} from '../../services/detalles-libro.service';
import {AlertInfoComponent, AlertType} from '../../../../shared/components/alert-info/alert-info.component';
import {CarritoService} from '../../../carrito/services/carrito.service';

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
  libroId: number = 0;
  @Input() libro: LibroDetalle | null = null;
  price: number = this.libro?.tiposTapa?.[0]?.precio;
  quantity: number = 1;
  selectedTipoTapa: any = null;
  alertMessage: string = '';
  alertType: AlertType = 'success';
  isAlertVisible: boolean = false;

  constructor(private detallesLibroService: DetallesLibroService, private cdRef: ChangeDetectorRef,  private cartService:CarritoService) {}

  ngOnInit() {
    console.log('tiposTapa en ngOnInit:', this.tiposTapa);
    this.libroId = this.libro?.id || 0;
    const initialTipo = this.libro?.tiposTapa?.[0];
    if (initialTipo) {
      this.selectedTipoTapa = { ...initialTipo, id_tipo: initialTipo.id };
    } else {
      this.selectedTipoTapa = null;
    }
    this.price = initialTipo?.precio || 0;
    this.cdRef.detectChanges();


    //   this.selectedTipoTapa = this.libro?.tiposTapa?.[0]?.id;
    //   // this.updatePrice();
    //   this.price =  this.libro?.tiposTapa?.[0]?.precio;


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tiposTapa'] && this.tiposTapa.length > 0) {
      this.selectedTipoTapa = this.tiposTapa[0];
      this.updatePrice();
    }
  }

  updateQuantity(amount: number) {
    if (this.quantity + amount > 0 && this.quantity + amount <= 10) {
      this.quantity += amount;
    } else if (this.quantity + amount > 10) {
      this.quantity = 10;
    } else {
      console.warn('La cantidad no puede ser menor que 1');
    }
  }

  selectCover(tipo: any) {
    this.selectedTipoTapa = { ...tipo };
    console.log('Tipo de tapa seleccionado:', this.selectedTipoTapa);
    this.quantity = 1;
    this.updatePrice();


    // this.selectedTipoTapa = { ...tipo, id_tipo: tipo.id }; // Asegurar que id_tipo se asigne correctamente
    // console.log('Tipo de tapa seleccionado:', this.selectedTipoTapa);
    // this.quantity = 1;
    // this.updatePrice();
  }

  updatePrice() {

    const tipoTapaActual = this.libro?.tiposTapa?.find(
      tipo => tipo.id === this.selectedTipoTapa?.id_tipo
    );
    if (tipoTapaActual) {
      this.price = tipoTapaActual.precio;
    }

    // let tipoTapaActual = this.libro?.tiposTapa?.find(tipo => tipo.id_tipo_tapa === this.selectedTipoTapa?.id_tipo_tapa);
    // this.price = tipoTapaActual?.precio || 0;
    // this.selectedTipoTapa.id_tipo = tipoTapaActual.id;



    // if (this.selectedTipoTapa && this.selectedTipoTapa.id_tipo_tapa && this.libroId) {
    //   console.log('Enviando al backend:', this.libroId, this.selectedTipoTapa.id_tipo_tapa);
    //
    //   this.detallesLibroService.getPrecioTapa(this.libroId, this.selectedTipoTapa.id_tipo_tapa).subscribe(
    //     (data) => {
    //       console.log('Precio recibido:', data);
    //       this.price = data.precio;  // Actualiza el precio en tu interfaz
    //
    //       // Asegúrate de actualizar el id_tipo en selectedTipoTapa
    //       this.selectedTipoTapa.id_tipo = data.id_tipo; // Asigna el id_tipo de la respuesta
    //     },
    //     (error) => {
    //       console.error('Error al obtener el precio:', error);
    //     }
    //   );
    // } else {
    //   console.error('selectedTipoTapa o libroId no definidos');
    // }
  }

  anadirAlCarrito() {
    if (!this.libroId || !this.selectedTipoTapa) {

      console.log(this.libroId);
      console.log(this.selectedTipoTapa);
      console.error('Datos incompletos para agregar al carrito');
      return;
    }
    console.log('ID del tipo:', this.selectedTipoTapa.id); // Verifica que sea numérico
    console.log('Cantidad:', this.quantity);
    const cartItem = {
      id: this.selectedTipoTapa.id, // Cambiado a id
      cantidad: this.quantity,
    };

    const existingItemIndex = this.cartService.cartItems.findIndex(
      (item) => item.id === cartItem.id // Cambiado a id
    );

    this.alertType = 'success';
    this.alertMessage = 'Producto añadido al carrito';

    if (existingItemIndex !== -1) {
      const newQuantity = this.cartService.cartItems[existingItemIndex].cantidad + cartItem.cantidad;
      if (newQuantity > 10) {
        this.alertMessage = 'No se puede añadir más de 10 unidades del mismo libro.';
        this.alertType = 'warning';
      } else {
        this.cartService.cartItems[existingItemIndex].cantidad = newQuantity;
        this.cartService.updateCartInLocalStorage();
      }
    } else {
      this.cartService.addItemToCart(cartItem);
    }

    this.isAlertVisible = true;

    setTimeout(() => {
      this.isAlertVisible = false;
    }, 2000);
  }




}
