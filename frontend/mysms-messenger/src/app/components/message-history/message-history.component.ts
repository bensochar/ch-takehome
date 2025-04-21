import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';

interface Message {
  _id: string;
  content: string;
  to_number: string;
  from_number: string;
  status: string;
  created_at: string;
  twilio_sid?: string;
  twilio_status?: string;
}

@Component({
  selector: 'app-message-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h2 class="card-title mb-4">Message History</h2>
        <div class="list-group">
          <div *ngFor="let message of messages" class="list-group-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <small class="text-muted">To: {{message.to_number}}</small>
              </div>
              <span [class]="getStatusBadgeClass(message.status)">
                {{message.status}}
              </span>
            </div>
            <p class="mb-1">{{message.content}}</p>
            <small class="text-muted d-block">
              {{message.created_at | date:'medium'}}
            </small>
          </div>
          <div *ngIf="messages.length === 0" class="list-group-item text-center text-muted">
            No messages found
          </div>
        </div>
      </div>
    </div>
  `
})
export class MessageHistoryComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages().subscribe({
      next: (response) => {
        this.messages = response;
      },
      error: (error) => {
        console.error('Error loading messages', error);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'badge';
    switch (status.toLowerCase()) {
      case 'sent':
        return `${baseClass} bg-success`;
      case 'failed':
        return `${baseClass} bg-danger`;
      case 'sending':
        return `${baseClass} bg-warning text-dark`;
      default:
        return `${baseClass} bg-secondary`;
    }
  }
}
