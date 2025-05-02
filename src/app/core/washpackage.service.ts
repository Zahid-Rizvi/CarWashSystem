import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WashPackage {
  washPackageID: number;
  packageName: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class WashPackageService {
  private baseUrl = `${environment.apiUrl}/api/WashPackage/available`; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  getAllWashPackages(): Observable<WashPackage[]> {
    return this.http.get<WashPackage[]>(`${this.baseUrl}`);
  }

//   getWashPackageById(id: number): Observable<WashPackage> {
//     return this.http.get<WashPackage>(`${this.baseUrl}/${id}`);
//   }
}
