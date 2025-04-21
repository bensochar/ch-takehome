import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message.model';
import { MessageComposeComponent } from '../message-compose/message-compose.component';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageComposeComponent],
  template: `
    <div class="container mt-4">
      <app-message-compose></app-message-compose>

      <div class="mt-4">
        <h3>Messages</h3>
        <div class="list-group">
          <div *ngFor="let message of messages" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-1">To: {{message.to_number}}</p>
                <p class="mb-1">{{message.content}}</p>
                <small class="text-muted">{{message.created_at | date:'medium'}}</small>
              </div>
              <span [class]="'badge ' + getStatusBadgeClass(message.status)">
                {{message.status}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'sent':
        return 'bg-success';
      case 'failed':
        return 'bg-danger';
      case 'sending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }
}
