import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor executing!');
    const token = this.authService.getToken();
    
    let authReq = req;
    if (token) {
      console.log('Token found, adding to headers:', token.substring(0, 10) + '...');
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('No token found');
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError = tryParseJson(error.error);

        console.log('Interceptor caught HTTP error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          errorBodyRaw: error.error,
          errorBodyParsed: parsedError,
        });

        if (error.status === 401 || error.status === 403) {
          console.log('Unauthorized or Forbidden - logging out user.');
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}

// Helper function to safely parse JSON, fallback to original if parse fails
function tryParseJson(json: any) {
  if (typeof json !== 'string') return json; // already an object or something else
  try {
    return JSON.parse(json);
  } catch {
    return json;
  }
}
