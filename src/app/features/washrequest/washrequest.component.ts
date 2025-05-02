import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CarService } from '../../core/car.service';
import { WashRequestService } from '../../core/washrequest.service';
import { AddOnService } from '../../core/addon.service';
import { WashPackageService } from '../../core/washpackage.service';

@Component({
  selector: 'app-wash-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './washrequest.component.html',
  styleUrl: './washrequest.component.scss'
})
export class WashRequestComponent implements OnInit {
  washRequestForm: FormGroup;
  carForm: FormGroup;

  userCars: any[] = [];
  washPackages: any[] = [];
  addOns: any[] = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private washRequestService: WashRequestService,
    private addOnService: AddOnService,
    private washPackageService: WashPackageService
  ) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900)]]
    });

    this.washRequestForm = this.fb.group({
      carId: ['', Validators.required],
      washPackageId: ['', Validators.required],
      addOnIds: [[]],
      location: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserCars();
    this.loadWashPackages();
    this.loadAddOns();
  }

  loadUserCars() {
    this.carService.getUserCars().subscribe({
      next: (res: any[]) => {
        this.userCars = res;
        if (this.userCars.length > 0) {
          this.washRequestForm.patchValue({ carId: this.userCars[0].carID });
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load cars.';
      }
    });
  }

  loadWashPackages() {
    this.washPackageService.getAllWashPackages().subscribe({
      next: (res: any[]) => this.washPackages = res,
      error: () => this.errorMessage = 'Failed to load wash packages.'
    });
  }

  loadAddOns() {
    this.addOnService.getAllAddOns().subscribe({
      next: (res: any[]) => this.addOns = res,
      error: () => this.errorMessage = 'Failed to load add-ons.'
    });
  }

  onCarSubmit() {
    if (this.carForm.valid) {
      this.carService.addCar(this.carForm.value).subscribe({
        next: () => {
          this.successMessage = 'Car added successfully!';
          this.carForm.reset();
          this.loadUserCars();
        },
        error: () => this.errorMessage = 'Failed to add car.'
      });
    }
  }

  onAddOnChange(event: any) {
    const selectedAddOns = this.washRequestForm.get('addOnIds')?.value || [];
    if (event.target.checked) {
      selectedAddOns.push(event.target.value);
    } else {
      const index = selectedAddOns.indexOf(event.target.value);
      if (index > -1) {
        selectedAddOns.splice(index, 1);
      }
    }
    this.washRequestForm.patchValue({ addOnIds: selectedAddOns });
  }

  autoFillLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const locationStr = `${pos.coords.latitude},${pos.coords.longitude}`;
          this.washRequestForm.patchValue({ location: locationStr });
          this.errorMessage = null;
        },
        () => {
          this.errorMessage = 'Failed to get location. Please allow location access.';
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by your browser.';
    }
  }

  onSubmit() {
    if (this.washRequestForm.valid) {
      const formValue = this.washRequestForm.value;

      // Convert location back to lat/lng for backend
      const [latitude, longitude] = formValue.location.split(',').map((x: string) => parseFloat(x));

      const payload = {
        ...formValue,
        latitude,
        longitude
      };

      delete payload.location;

      this.washRequestService.submitRequest(payload).subscribe({
        next: () => {
          this.successMessage = 'Wash Request Submitted!';
          this.washRequestForm.reset();
        },
        error: () => this.errorMessage = 'Failed to submit wash request.'
      });
    }
  }
}
