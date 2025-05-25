import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WashRequestService {
  private baseUrl = `${environment.apiUrl}/api/Washrequest`; // Adjust as needed

  constructor(private http: HttpClient) {}

  // Submit a wash request
  submitRequest(requestData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, requestData);
  }

  // Optionally: Get packages and add-ons
  getWashPackages(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5062/api/WashPackage');
  }

  getAddOns(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5062/api/AddOn');
  }
}
