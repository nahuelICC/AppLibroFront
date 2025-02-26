import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilUsuarioService } from '../../../features/usuario/services/perfil-usuario.service';
import { AuthServiceService } from '../../../core/services/auth-service.service';
import { HttpClient } from '@angular/common/http';
import {NotificacionesService} from '../../services/notificaciones.service';

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
  messages: { text: string, isUser: boolean, buttons?: { text: string, action: string }[] }[] = [];
  userInput: string = '';
  isLoggedIn: boolean = false;
  isSendingEmail: boolean = false;
  predefinedQuestions: string[] = [
    'Tengo duda/consulta sobre mi pedido',
    'Tengo duda/consulta sobre mi suscripción',
    'Contactar con soporte'
  ];
  selectedQuestion: string = '';
  datosCliente: any = { pedidos: [], suscripcion: { fechaFin: '', suscrito: false } };

  constructor(
    private perfilUsuarioService: PerfilUsuarioService,
    private authService: AuthServiceService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private notificacionesService: NotificacionesService
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

    const lastMessage = this.messages[this.messages.length - 1];

    if (lastMessage && lastMessage.text.includes('Escribe tu duda en el campo de texto y presiona enviar.')) {
      this.sendSupportEmail(); // Si es una consulta de soporte, usa este método
    } else {
      this.messages.push({ text: this.userInput, isUser: true });

      const response = this.getResponse(this.userInput);
      this.messages.push(response);

      this.userInput = '';
      this.scrollToBottom();
    }
  }

  handleButtonClick(action: string) {
    this.messages.push({ text: action, isUser: true });
    const response = this.getResponse(action);
    this.messages.push(response);
    this.scrollToBottom();
  }

  getResponse(userInput: string): { text: string, isUser: boolean, buttons?: { text: string, action: string }[] } {
    let lowerInput = userInput.toLowerCase();

    if (lowerInput === 'pedido') {
      userInput = 'Tengo duda/consulta sobre mi pedido';
      lowerInput = userInput.toLowerCase();
    } else if (lowerInput === 'suscripción' || lowerInput === 'suscripcion') {
      userInput = 'Tengo duda/consulta sobre mi suscripción';
      lowerInput = userInput.toLowerCase();
    } else if (lowerInput === 'soporte') {
      userInput = 'Contactar con soporte';
      lowerInput = userInput.toLowerCase();
    }

    if (lowerInput === 'tengo duda/consulta sobre mi pedido') {
      const pedidosFiltrados = this.datosCliente.pedidos.filter((pedido: any) => !pedido.referencia.startsWith('MISTERY'));
      const buttons = pedidosFiltrados.map((pedido: any) => ({ text: pedido.referencia, action: `Consulta sobre ${pedido.referencia}` }));
      return { text: 'Selecciona tu pedido:', isUser: false, buttons };
    } else if (lowerInput === 'tengo duda/consulta sobre mi suscripción') {
      if (this.datosCliente.suscripcion === "todavía no te has suscrito") {
        return { text: 'No estás suscrito. Puedes visitar la sección de Suscripciones para hacerlo.', isUser: false };
      } else {
        return {
          text: '¿Qué consulta tienes sobre tu suscripción?',
          isUser: false,
          buttons: [
            { text: '¿Cuándo termina mi suscripción?', action: '¿Cuándo termina mi suscripción?' },
            { text: 'Tengo duda sobre mi Mystery Box', action: 'Tengo duda sobre mi Mystery Box' }
          ]
        };
      }
    } else if (lowerInput === 'tengo duda sobre mi mystery box') {
      const pedidosMistery = this.datosCliente.pedidos.filter((pedido: any) => pedido.referencia.startsWith('MISTERY'));
      const buttons = pedidosMistery.map((pedido: any) => ({ text: pedido.referencia, action: `Consulta sobre ${pedido.referencia}` }));
      return { text: 'Selecciona tu pedido Mystery Box:', isUser: false, buttons };
    } else if (lowerInput.startsWith('consulta sobre')) {
      const pedidoReferencia = userInput.split('Consulta sobre ')[1];
      const pedido = this.datosCliente.pedidos.find((p: any) => p.referencia === pedidoReferencia);
      if (pedido) {
        const fechaFormateada = this.datePipe.transform(pedido.fecha, 'dd/MM/yyyy');
        const buttons = [
          { text: '¿Cuándo llegará mi pedido?', action: `¿Cuándo llegará mi pedido ${pedidoReferencia}?` },
          { text: 'Quiero cancelar mi pedido', action: `Cancelar pedido ${pedidoReferencia}` }
        ];
        return { text: `Has seleccionado el pedido: ${pedidoReferencia} (Fecha: ${fechaFormateada})`, isUser: false, buttons };
      } else {
        return { text: 'No se encontró el pedido.', isUser: false };
      }
    } else if (lowerInput.startsWith('¿cuándo llegará mi pedido')) {
      const pedidoReferencia = userInput.split('¿Cuándo llegará mi pedido ')[1].replace('?', '');
      const pedido = this.datosCliente.pedidos.find((p: any) => p.referencia === pedidoReferencia);
      if (pedido) {
        const fechaLlegada = new Date(pedido.fecha);
        let mensaje = '';

        switch (pedido.estado) {
          case 1:
            fechaLlegada.setDate(fechaLlegada.getDate() + 5);
            mensaje = `Se entregará aproximadamente el ${this.datePipe.transform(fechaLlegada, 'dd/MM/yyyy')}.`;
            break;
          case 3:
            fechaLlegada.setDate(fechaLlegada.getDate() + 2);
            mensaje = `Su pedido ha sido enviado y llegará aproximadamente el ${this.datePipe.transform(fechaLlegada, 'dd/MM/yyyy')}.`;
            break;
          case 4:
            mensaje = 'Su pedido está en reparto. Se entregará hoy.';
            break;
          case 5:
            mensaje = 'Este pedido ya ha sido entregado.';
            break;
          default:
            mensaje = 'No se pudo determinar el estado del pedido.';
            break;
        }

        return { text: mensaje, isUser: false };
      } else {
        return { text: 'No se encontró el pedido.', isUser: false };
      }
    } else if (lowerInput === '¿cuándo termina mi suscripción?') {
      const fechaFin = this.datosCliente.suscripcion.fechaFin;
      const isSubscribed = this.datosCliente.suscripcion.suscrito;
      const renovacion = isSubscribed ? ' Se renovará automáticamente.' : ' Puedes volver a suscribirte desde "Mi cuenta".';
      return {
        text: `Tu suscripción termina el ${this.datePipe.transform(fechaFin, 'dd/MM/yyyy')}.${renovacion}`,
        isUser: false
      };
    } else if (lowerInput === 'contactar con soporte') {
      return {
        text: 'Selecciona una opción:',
        isUser: false,
        buttons: [
          { text: 'Pedido', action: 'Contactar soporte - Pedido' },
          { text: 'Suscripción', action: 'Contactar soporte - Suscripción' },
          { text: 'Otros', action: 'Contactar soporte - Otros' }
        ]
      };
    } else if (lowerInput === 'contactar soporte - pedido') {
      const buttons = this.datosCliente.pedidos.filter((pedido: any) => !pedido.referencia.startsWith('MISTERY')).map((pedido: any) => ({ text: pedido.referencia, action: `Soporte Pedido ${pedido.referencia}` }));
      return { text: 'Selecciona tu pedido:', isUser: false, buttons };
    } else if (lowerInput === 'contactar soporte - suscripción') {
      const buttons = this.datosCliente.pedidos.filter((pedido: any) => pedido.referencia.startsWith('MISTERY')).map((pedido: any) => ({ text: pedido.referencia, action: `Soporte Suscripción ${pedido.referencia}` }));
      return { text: 'Selecciona tu pedido Mystery Box:', isUser: false, buttons };
    } else if (lowerInput === 'contactar soporte - otros') {
      return { text: 'Escribe tu duda en el campo de texto y presiona enviar.', isUser: false };
    } else if (lowerInput.startsWith('soporte pedido') || lowerInput.startsWith('soporte suscripción')) {
      return { text: 'Escribe tu duda en el campo de texto y presiona enviar.', isUser: false };
    } else if (lowerInput.startsWith('cancelar pedido')) {
      const pedidoReferencia = userInput.split('Cancelar pedido ')[1];
      const pedido = this.datosCliente.pedidos.find((p: any) => p.referencia === pedidoReferencia);
      if (pedido) {
        if (pedido.referencia.startsWith('MISTERY')) {
          return { text: 'Los envios de Mystery Box no se pueden cancelar, por favor contacta con soporte para más ayuda.', isUser: false };
        } else if (pedido.estado === 1) {
          return { text: 'Puedes cancelar tu pedido entrando en "Mi Cuenta" --> "Historial de pedidos".', isUser: false };
        } else {
          return { text: 'No puedes cancelar el pedido en este estado, contacta con soporte para más ayuda.', isUser: false };
        }
      } else {
        return { text: 'No se encontró el pedido.', isUser: false };
      }
    } else {
      return { text: 'No puedo resolver tu duda. Por favor, envía un correo a contacto.tinteka@gmail.com para obtener ayuda.', isUser: false };
    }
  }

  sendSupportEmail() {
    if (!this.userInput.trim()) return;

    this.isSendingEmail = true; // Desactiva el botón y cambia el texto

    const selectedOption = this.messages[this.messages.length - 2]?.text || 'Otros';
    const username = this.datosCliente?.username || 'Desconocido';
    const email = this.datosCliente?.email || 'sin-email@example.com';
    const referencia = selectedOption.includes('Pedido') ? selectedOption.split(' ')[2] : 'Otros';
    const mensaje = this.userInput;

    this.http.post('/api/clientes/contacto', {
      username,
      email,
      referencia,
      mensaje
    }).subscribe({
      next: (response) => {
        console.log('Correo enviado correctamente', response);
        this.messages.push({ text: 'Se ha enviado un email a soporta con su consulta, le responderemos lo antes posible.', isUser: false });
        this.isSendingEmail = false; // Reactiva el botón
        this.notificacionesService.actualizarCantidadNotificaciones();
      },
      error: (err) => {
        console.error('Error enviando correo:', err);
        this.messages.push({ text: 'Hubo un error al enviar su email. Por favor, inténtelo de nuevo más tarde.', isUser: false });
        this.isSendingEmail = false; // Reactiva el botón aunque haya error
      }
    });

    this.userInput = ''; // Limpiar campo de entrada
  }

  clearChat() {
    this.messages = [{ text: '¿En qué puedo ayudarte hoy?', isUser: false }];
    this.selectedQuestion = '';
    this.userInput = '';
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  selectQuestion() {
    if (this.selectedQuestion) {
      this.userInput = this.selectedQuestion;
      this.sendMessage();
      this.cdr.detectChanges();
    }
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
