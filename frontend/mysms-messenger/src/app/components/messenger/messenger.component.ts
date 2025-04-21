import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageComposeComponent } from '../message-compose/message-compose.component';
import { MessageHistoryComponent } from '../message-history/message-history.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [CommonModule, MessageComposeComponent, MessageHistoryComponent],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h1>MY SMS MESSENGER</h1>
        <button class="btn btn-outline-danger" (click)="onSignOut()">Sign Out</button>
      </div>
      <div class="row g-4">
        <div class="col-md-6">
          <app-message-compose></app-message-compose>
        </div>
        <div class="col-md-6">
          <app-message-history></app-message-history>
        </div>
      </div>
    </div>
  `
})
export class MessengerComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignOut() {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Error signing out:', error);
      }
    });
  }
}
