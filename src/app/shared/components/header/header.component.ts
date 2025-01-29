// src/app/shared/components/header/header.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public authService: AuthServiceService) {}

  logout(): void {
    this.authService.logout();
    // Redirect to main page after logout
    window.location.href = '/main';
  }

  get isAuthenticated(): boolean {
    return this.authService.isLogged();
  }
}
