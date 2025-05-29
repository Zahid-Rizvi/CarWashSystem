import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Define interfaces for your DTOs if you want strict typing
export interface WashPackage {
  washPackageID: string;
  packageName: string;
  description: string;
  price: number;
}

export interface AddOn {
  addOnID: string;
  addOnName: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  getWashPackages(): Observable<WashPackage[]> {
    return this.http.get<WashPackage[]>(`${environment.apiUrl}/api/WashPackage/available`);
  }

  getAddOns(): Observable<AddOn[]> {
    return this.http.get<AddOn[]>(`${environment.apiUrl}/api/AddOn`);
  }
}
