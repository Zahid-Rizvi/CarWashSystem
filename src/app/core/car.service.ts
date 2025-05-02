import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private baseUrl = `${environment.apiUrl}/api/Cars`; // Adjust port as per your backend

  constructor(private http: HttpClient) {}

  // Get cars for the logged-in user
  getUserCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Cars`);
  }

  // Add a new car
  addCar(carData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, carData);
  }
}
