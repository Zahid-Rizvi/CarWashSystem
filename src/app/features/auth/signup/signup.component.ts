import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  errorMessage: string = '';
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      contactInfo: [''],
      role: ['Customer', Validators.required],
      latitude: [''],
      longitude: [''],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
    }
  }

  get isWasher() {
    return this.signupForm.get('role')?.value === 'Washer';
  }

  onSubmit() {
    this.errorMessage = '';

    const formDataValues = this.signupForm.value;
    const lat = parseFloat(formDataValues.latitude);
    const lon = parseFloat(formDataValues.longitude);

    if (
      this.signupForm.invalid ||
      (this.isWasher && (isNaN(lat) || isNaN(lon)))
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('email', formDataValues.email);
    formData.append('password', formDataValues.password);
    formData.append('name', formDataValues.name);
    formData.append('role', formDataValues.role);
    if (formDataValues.contactInfo) {
      formData.append('contactInfo', formDataValues.contactInfo);
    }

    if (this.isWasher) {
      formData.append('latitude', lat.toString());
      formData.append('longitude', lon.toString());
    }

    if (this.selectedImageFile) {
      formData.append('profilePicture', this.selectedImageFile);
    }

    this.loading = true;

    this.authService.signup(formData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      },
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.signupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          this.errorMessage = 'Location access denied or unavailable.';
        }
      );
    } else {
      this.errorMessage = 'Geolocation not supported by this browser.';
    }
  }
}
