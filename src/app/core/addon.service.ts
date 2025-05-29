import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AddOn {
  addOnID?: number;
  name: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddOnService {
  private baseUrl = `${environment.apiUrl}/api/AddOn`;

  constructor(private http: HttpClient) {}

  getAllAddOns(): Observable<AddOn[]> {
    return this.http.get<AddOn[]>(this.baseUrl);
  }

  getAddOnById(id: number): Observable<AddOn> {
    return this.http.get<AddOn>(`${this.baseUrl}/${id}`);
  }

  createAddOn(addOn: Partial<AddOn>): Observable<AddOn> {
    return this.http.post<AddOn>(this.baseUrl, addOn);
  }

  updateAddOn(id: number, addOn: Partial<AddOn>): Observable<AddOn> {
    return this.http.put<AddOn>(`${this.baseUrl}/${id}`, addOn);
  }

  deleteAddOn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
