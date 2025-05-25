import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AddOn {
  addOnID: number;
  addOnName: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddOnService {
  private baseUrl = `${environment.apiUrl}/api/AddOn`; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  getAllAddOns(): Observable<AddOn[]> {
    return this.http.get<AddOn[]>(`${this.baseUrl}`);
  }

  getAddOnById(id: number): Observable<AddOn> {
    return this.http.get<AddOn>(`${this.baseUrl}/${id}`);
  }
}
