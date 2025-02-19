import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {ChatbotComponent} from '../chatbot/chatbot.component';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    ChatbotComponent
  ],
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
