import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WashRequestService {
  private baseUrl = `${environment.apiUrl}/api/WashRequest`; // Adjust as needed

  constructor(private http: HttpClient) {}

  // Submit a wash request
  submitRequest(requestData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, requestData);
  }
  
  getWashRequest(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  cancelWashRequest(requestId: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/cancel/${requestId}`);
}
}
