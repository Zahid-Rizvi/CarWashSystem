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
  mustChangePassword?: boolean;
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
    const userData = localStorage.getItem('user');
    this.currentUserSubject = new BehaviorSubject<any>(userData ? JSON.parse(userData) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${environment.apiUrl}/api/Auth/login`, { email, password }).pipe(
    tap((response) => {
      const normalizedUser = {
        email: response.email,
        name: response.name,
        roles: response.roles,
        token: response.token,
        mustChangePassword: response.mustChangePassword || false  // Save flag
      };
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('token', response.token);
      this.currentUserSubject.next(normalizedUser);
    })
  );
}


  signup(signupData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Auth/register`, signupData);
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

  updateProfile(userData: any) {
    return this.http.put(`${environment.apiUrl}/api/user/update-profile`, userData);
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return this.http.post(`${environment.apiUrl}/api/user/change-password`, passwordData);
  }

  // --- admin methods ---

  getPendingWashRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/Admin/pending-washers`);
  }

approveWasherRequest(requestId: string): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/Admin/approve-washer/${requestId}`, {});
}

rejectWasherRequest(requestId: string): Observable<any> {
  return this.http.delete(`${environment.apiUrl}/api/Admin/reject-washer/${requestId}`);
}

addUserAsAdmin(userData: SignupRequest): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/Admin/admin-add-user`, userData);
}

}
