import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilUsuarioService } from '../../../features/usuario/services/perfil-usuario.service';
import { AuthServiceService } from '../../../core/services/auth-service.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  isChatbotVisible: boolean = false;
  isChatOpen: boolean = false;
  messages: { text: string, isUser: boolean }[] = [];
  userInput: string = '';
  isLoggedIn: boolean = false;
  predefinedQuestions: string[] = [
    '¿Cuándo llegará mi pedido?',
    '¿Cuáles son mis pedidos?',
    '¿Cómo puedo cambiar mi suscripción?',
    '¿Cuándo termina mi suscripción?',
    '¿Cómo contactar con soporte?',
  ];
  selectedQuestion: string = '';
  selectedPedido: string = '';
  selectedPedidoQuestion: string = '';
  showPedidosOptions: boolean = false;
  showPedidoDetails: boolean = false;
  datosCliente: any = { pedidos: [], suscripcion: { fechaFin: '', suscrito: false } };

  constructor(
    private perfilUsuarioService: PerfilUsuarioService,
    private authService: AuthServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLogged) => {
      this.isLoggedIn = isLogged;
      this.isChatbotVisible = isLogged;
      if (isLogged) {
        this.cargarDatosCliente();
      }
    });
  }

  checkLoginStatus() {
    const logged = localStorage.getItem('logged');
    this.isLoggedIn = logged === 'true';
    this.isChatbotVisible = this.isLoggedIn;
    if (this.isLoggedIn) {
      this.cargarDatosCliente();
    }
  }

  listenForLogin() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'logged') {
        this.checkLoginStatus();
      }
    });
  }

  cargarDatosCliente() {
    this.perfilUsuarioService.getDatosCliente().subscribe({
      next: (data) => {
        this.datosCliente = data;
        console.log('Datos del cliente cargados:', this.datosCliente);
      },
      error: (err) => console.error('Error cargando datos:', err)
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.messages.length === 0) {
      this.messages.push({ text: '¿En qué puedo ayudarte hoy?', isUser: false });
    }
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.userInput.trim() === '') return;

    this.messages.push({ text: this.userInput, isUser: true });
    const response = this.getResponse(this.userInput);
    this.messages.push({ text: response, isUser: false });

    this.userInput = '';
    this.scrollToBottom();
  }

  selectQuestion() {
    if (this.selectedQuestion === 'pedido') {
      this.showPedidosOptions = true;
      this.showPedidoDetails = false;
      if (this.datosCliente.pedidos.length === 0) {
        this.messages.push({ text: 'No tienes pedidos, puedes ir a la Tienda para realizar tu compra.', isUser: false });
      }
    } else if (this.selectedQuestion === 'suscripcion') {
      this.showPedidosOptions = false;
      this.showPedidoDetails = false;
      this.messages.push({ text: this.getResponse('cuándo termina mi suscripción'), isUser: false });
    } else if (this.selectedQuestion === 'cambiar_suscripcion') {
      this.showPedidosOptions = false;
      this.showPedidoDetails = false;
      this.messages.push({ text: this.getResponse('cambiar mi suscripción'), isUser: false });
    }
    this.selectedQuestion = '';
  }

  selectPedido() {
    if (this.selectedPedido) {
      this.showPedidoDetails = true;
    }
  }

  selectPedidoQuestion() {
    if (this.selectedPedidoQuestion === 'llegada') {
      const pedido = this.datosCliente.pedidos.find((p: any) => p.referencia === this.selectedPedido);
      if (pedido) {
        const fechaPedido = new Date(pedido.fecha);
        const fechaLlegada = new Date(fechaPedido.setDate(fechaPedido.getDate() + 5));
        const formattedDate = this.datePipe.transform(fechaLlegada, 'dd/MM/yyyy');
        this.messages.push({ text: `Tu pedido llegará entre 3 y 5 días hábiles, aproximadamente el ${formattedDate}.`, isUser: false });
      }
    } else if (this.selectedPedidoQuestion === 'cancelar') {
      this.messages.push({ text: 'La funcionalidad para cancelar pedidos estará disponible pronto.', isUser: false });
    }
    this.selectedPedidoQuestion = '';
  }

  getResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('cuándo llegará mi pedido')) {
      return 'Tu pedido llegará en 3-5 días hábiles.';
    } else if (lowerInput.includes('cambiar mi suscripción')) {
      return 'Puedes cambiar tu suscripción desde la sección de "Mis Suscripciones" en tu perfil.';
    } else if (lowerInput.includes('cuándo termina mi suscripción')) {
      const fechaFin = this.datosCliente.suscripcion.fechaFin;
      const isSubscribed = this.datosCliente.suscripcion.suscrito;
      const renovacion = isSubscribed ? ' Se renovará automáticamente.' : '';
      if (fechaFin) {
        const formattedDate = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
        return `Tu suscripción termina el ${formattedDate}. Puedes renovarla en cualquier momento.${renovacion}`;
      } else {
        return 'No se pudo obtener la fecha de finalización de tu suscripción.';
      }
    } else if (lowerInput.includes('contactar con soporte')) {
      return 'Puedes enviar un correo a contacto.tinteka@gmail.com y te responderemos lo antes posible.';
    } else if (lowerInput.includes('beneficios suscripción plus')) {
      return 'La suscripción Plus te permite recibir 2 libros al mes del género elegido, con un 10% de descuento en cada envío.';
    } else if (lowerInput.includes('cuáles son mis pedidos')) {
      const pedidosOrdenados = this.datosCliente.pedidos.sort((a: any, b: any) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });

      if (pedidosOrdenados.length === 0) {
        return 'No tienes pedidos.';
      } else if (pedidosOrdenados.length === 1) {
        const pedido = pedidosOrdenados[0];
        const fechaFormateada = this.datePipe.transform(pedido.fecha, 'dd/MM/yyyy HH:mm');
        return `Tu pedido es:<br><strong>${pedido.referencia}</strong> - ${pedido.genero} - ${fechaFormateada}`;
      } else {
        const pedidosFormateados = pedidosOrdenados.map((pedido: any) => {
          const fechaFormateada = this.datePipe.transform(pedido.fecha, 'dd/MM/yyyy HH:mm');
          return `<li><strong>${pedido.referencia}</strong> - ${pedido.genero} - ${fechaFormateada}</li>`;
        }).join('');
        return `Tus pedidos son:<ul class="list-disc pl-5">${pedidosFormateados}</ul>`;
      }
    } else {
      return 'No puedo resolver tu duda. Por favor, envía un correo a contacto.tinteka@gmail.com para obtener ayuda.';
    }
  }

  clearChat() {
    this.messages = [{ text: '¿En qué puedo ayudarte hoy?', isUser: false }];
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }, 0);
  }
}
