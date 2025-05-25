import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any;
  pfp:string = 'assets/Profile.png';
  logo:string = 'assets/logo.png';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = !!this.authService.currentUserValue;
    if (this.isLoggedIn) {
      this.user = this.authService.currentUserValue;
    }
  }

  // Navigate to profile/dashboard
  goToProfile(): void {
    this.router.navigate(['/dashboard']);
  }

}
