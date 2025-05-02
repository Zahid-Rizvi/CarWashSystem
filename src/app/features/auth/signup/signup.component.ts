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
      profilePicture: [''],
      role: ['Customer', Validators.required], // default to Customer
      latitude: [''],
      longitude: [''],
    });
  }

  get isWasher() {
    return this.signupForm.get('role')?.value === 'Washer';
  }

  onSubmit() {
    this.errorMessage = '';

    const formData = this.signupForm.value;

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);

    // Enhanced validation for Washer
    if (
      this.signupForm.invalid ||
      (this.isWasher && (isNaN(lat) || isNaN(lon)))
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;

    const signupPayload: any = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      profilePicture: formData.profilePicture || ''
    };

    if (formData.contactInfo) {
      signupPayload.contactInfo = formData.contactInfo;
    }

    if (this.isWasher) {
      signupPayload.latitude = lat;
      signupPayload.longitude = lon;
    }

    this.authService.signup(signupPayload).subscribe({
      next: () => {
        this.loading = false;
        console.log("SignUp is working fine")
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
