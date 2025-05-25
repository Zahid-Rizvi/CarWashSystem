// src/app/core/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  notificationID: string;
  message: string;
  notificationType: string;
  readStatus: boolean;
  timestamp: string;
  relatedEntityId: string; 
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getUserNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/api/Notification`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/Notification/mark-as-read/${notificationId}`, {});
  }

  acceptWashRequest(washRequestId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/WasherWashRequest/accept/${washRequestId}`, {});
  }

  rejectWashRequest(washRequestId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/WasherWashRequest/reject/${washRequestId}`, {});
  }
}
