import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
  this.errorMessage = '';
  if (this.loginForm.invalid) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }

  const { email, password } = this.loginForm.value;
  this.loading = true;

  this.authService.login(email, password).subscribe({
    next: (response) => {
      this.loading = false;
      if (response.mustChangePassword) {
        // Redirect washer to change-password page immediately
        this.router.navigate(['/change-password']);
      } else {
        // Normal navigation
        this.router.navigate(['']);
      }
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = err.error?.message || 'Login failed.';
    },
  });
}

}
