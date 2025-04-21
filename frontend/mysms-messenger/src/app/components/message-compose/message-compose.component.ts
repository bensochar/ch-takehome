import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-compose',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h2 class="card-title mb-4">New Message</h2>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            [(ngModel)]="phoneNumber"
            class="form-control"
            placeholder="Enter phone number"
          />
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">Message</label>
          <textarea
            id="message"
            [(ngModel)]="messageContent"
            class="form-control"
            placeholder="Type your message"
            rows="4"
          ></textarea>
          <div class="form-text text-end">{{messageContent.length}}/250</div>
        </div>
        <div class="d-flex justify-content-between gap-2">
          <button class="btn btn-outline-secondary" (click)="clearForm()">
            Clear
          </button>
          <button
            class="btn btn-primary"
            (click)="submitMessage()"
            [disabled]="!isValidForm()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  `
})
export class MessageComposeComponent {
  phoneNumber: string = '';
  messageContent: string = '';

  constructor(private messageService: MessageService) {}

  clearForm() {
    this.phoneNumber = '';
    this.messageContent = '';
  }

  isValidForm(): boolean {
    return this.phoneNumber.trim().length > 0 &&
           this.messageContent.trim().length > 0 &&
           this.messageContent.length <= 250;
  }

  submitMessage() {
    if (!this.isValidForm()) return;

    this.messageService.sendMessage({
      to_number: this.phoneNumber,
      content: this.messageContent
    }).subscribe({
      next: (response) => {
        console.log('Message sent successfully', response);
        this.clearForm();
      },
      error: (error) => {
        console.error('Error sending message', error);
      }
    });
  }
}
