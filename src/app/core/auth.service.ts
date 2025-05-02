// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  expires: string;
  email: string;
  name: string;
  roles: string[];
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: string;
  contactInfo?: string;
  profilePicture?: string;
  latitude?: number;
  longitude?: number;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/Auth/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response);
      })
    );
  }

  signup(signupData: SignupRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Auth/register`, signupData);
    // You don't need to store token or user here as you are redirecting to login after signup
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
