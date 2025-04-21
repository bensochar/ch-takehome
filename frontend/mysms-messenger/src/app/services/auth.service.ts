import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  data: {
    email: string;
    uid: string;
    id: number;
    provider: string;
    allow_password_change: boolean;
    name: string;
  };
  success: boolean;
}

export interface SignUpRequest {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  signUp(credentials: SignUpRequest): Observable<HttpResponse<AuthResponse>> {
    const params = new URLSearchParams();
    Object.entries(credentials).forEach(([key, value]) => {
      params.append(key, value);
    });
    params.append('confirm_success_url', 'http://localhost:4200');

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth`, params.toString(), {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    }).pipe(
      tap(response => {
        this.setAuthHeaders(response.headers);
      })
    );
  }

  signIn(credentials: SignInRequest): Observable<HttpResponse<AuthResponse>> {
    const params = new URLSearchParams();
    Object.entries(credentials).forEach(([key, value]) => {
      params.append(key, value);
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/sign_in`, params.toString(), {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    }).pipe(
      tap(response => {
        console.log('Response headers:', response.headers);
        console.log('All header keys:', response.headers.keys());
        console.log('Access-Token:', response.headers.get('access-token'));
        console.log('Client:', response.headers.get('client'));
        console.log('Uid:', response.headers.get('uid'));
        this.setAuthHeaders(response.headers);
      })
    );
  }

  signOut(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/sign_out`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.clearAuthHeaders();
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');
    console.log('Auth state:', { token, client, uid });
    return !!(token && client && uid);
  }

  private setAuthHeaders(headers: HttpHeaders) {
    const token = headers.get('access-token');
    const client = headers.get('client');
    const uid = headers.get('uid');

    console.log('Setting auth headers:', { token, client, uid });

    if (token) localStorage.setItem('access-token', token);
    if (client) localStorage.setItem('client', client);
    if (uid) localStorage.setItem('uid', uid);
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access-token': localStorage.getItem('access-token') || '',
      'client': localStorage.getItem('client') || '',
      'uid': localStorage.getItem('uid') || ''
    });
  }

  private clearAuthHeaders() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
  }
}
