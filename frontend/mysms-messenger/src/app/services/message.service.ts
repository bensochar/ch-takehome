import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  _id: string;
  content: string;
  to_number: string;
  from_number: string;
  status: string;
  created_at: string;
  twilio_sid?: string;
  twilio_status?: string;
}

export interface MessageRequest {
  to_number: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // In a real app, these would come from an auth service
    const token = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'access-token': token || '',
      'client': client || '',
      'uid': uid || ''
    });
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`, {
      headers: this.getHeaders()
    });
  }

  sendMessage(message: MessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, { message }, {
      headers: this.getHeaders()
    });
  }
}
