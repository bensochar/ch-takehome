import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get auth headers from localStorage
    const token = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    // Only add auth headers if they exist
    if (token && client && uid) {
      request = request.clone({
        setHeaders: {
          'access-token': token,
          'client': client,
          'uid': uid
        }
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        // If it's a response with headers, check for new auth tokens
        if (event instanceof HttpResponse) {
          const newToken = event.headers.get('access-token');
          const newClient = event.headers.get('client');
          const newUid = event.headers.get('uid');

          // Update localStorage if we got new tokens
          if (newToken) localStorage.setItem('access-token', newToken);
          if (newClient) localStorage.setItem('client', newClient);
          if (newUid) localStorage.setItem('uid', newUid);

          console.log('Auth headers in response:', {
            'access-token': newToken,
            'client': newClient,
            'uid': newUid
          });
        }
      })
    );
  }
}
