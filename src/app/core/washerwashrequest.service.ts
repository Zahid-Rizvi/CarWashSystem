// src/app/core/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WasherwashrequestService {
  constructor(private http: HttpClient) {}

  getAvailableWashRequest(): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/WasherWashRequest/available`);
  }

  getAssignedRequests(): Observable<any> {
  return this.http.get<any[]>(`${environment.apiUrl}/api/WasherWashRequest/assigned`);
  }

  acceptWashRequest(washRequestId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/WasherWashRequest/accept/${washRequestId}`, {});
  }

  rejectWashRequest(washRequestId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/WasherWashRequest/reject/${washRequestId}`, {});
  }
}
