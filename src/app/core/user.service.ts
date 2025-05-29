// core/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface GroupedUsers {
  [role: string]: { id: string; name: string; email: string }[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/api/Admin/all-users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<GroupedUsers> {
    return this.http.get<GroupedUsers>(this.baseUrl);
  }
}
