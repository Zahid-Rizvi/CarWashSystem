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
  currentStep = 1;

  carForm!: FormGroup;
  washRequestForm!: FormGroup;

  carAdded = false;
  cars: any[] = [];
  washPackages: any[] = [];
  addons: any[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private washRequestService: WashRequestService,
    private washPackageService: WashPackageService,
    private addOnService: AddOnService
  ) {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      color: ['', Validators.required],
      licensePlate: ['', Validators.required]
    });

    this.washRequestForm = this.fb.group({
      carId: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      washPackageId: ['', Validators.required],
      scheduledDateTime: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {

    this.loadUserCars();
    this.loadWashPackages();
    this.loadAddOns();
  }

  goToStep(step: number) {
    this.currentStep = step;
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
  
  loadWashPackages() {
    this.washPackageService.getAllWashPackages().subscribe({
      next: (data) => (this.washPackages = data),
      error: (err) => console.error('Error loading packages', err)
    });
  }

  loadAddOns() {
    this.addOnService.getAllAddOns().subscribe({
      next: (data) => (this.addons = data),
      error: (err) => console.error('Error loading addons', err)
    });
  }
  loadUserCars() {
    this.carService.getUserCars().subscribe((cars) => {
      this.cars = cars;
      if (this.cars.length > 0) {
        this.carAdded = true;
        this.goToStep(2);
      }
    });
  }
  

  autoFillLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.washRequestForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }

  onCarSubmit() {
    console.log("sss");
    if(this.carForm.valid)
    {
      console.log('Form Value:', this.carForm.value);
    }
    if (this.carForm.valid) {
      this.carService.addCar(this.carForm.value).subscribe({
        next: () => {
          this.successMessage = 'Car added successfully!';
          this.carForm.reset();
          this.loadUserCars();
          this.carAdded = true;
          this.goToStep(2);
        },
        error: () => this.errorMessage = 'Failed to add car.'
      });
    }
  }

  skipCarForm() {
    this.carAdded = true;
    this.goToStep(2);
  }

  onSubmit() {
    if (this.washRequestForm.valid) {
      this.washRequestService.submitRequest(this.washRequestForm.value).subscribe({
        next: () => {
          this.successMessage = 'Wash request submitted!';
          this.goToStep(3);
        },
        error: () => this.errorMessage = 'Submission failed.'
      });
    }
  }
}


