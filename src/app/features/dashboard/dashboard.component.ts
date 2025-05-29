import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { NotificationService } from '../../core/notification.service';
import { WashPackageService } from '../../core/washpackage.service';
import { AddOnService, AddOn } from '../../core/addon.service';
import { UserService, GroupedUsers } from '../../core/user.service';
import { WashRequestService } from '../../core/washrequest.service';
import { WasherwashrequestService } from '../../core/washerwashrequest.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activeTab = 'profile';
  user: any = {};
  notifications: any[] = [];
  currentWashRequest: any[] = [];
  washerWashRequest: any[] = [];
  assignedWashRequest: any[] = [];

  // Role flags
  isAdmin: boolean = false;
  isWasher: boolean = false;
  isCustomer: boolean = false;

  // Admin section
  groupedUsers: GroupedUsers = {};
  pendingWashRequests: any[] = [];
  washPackages: any[] = [];
  addOns: AddOn[] = [];

  // Forms
  newPackage = { packageName: '', description: '', price: 0 };
  showAddPackage = false;

  newAddOn: AddOn = { name: '', description: '', price: 0 };
  showAddAddOn = false;

  passwordData = { currentPassword: '', newPassword: '' };

  newUser = {
    name: '',
    email: '',
    password: '',
    contactInfo: '',
    profilePicture: '',
    role: 'Customer',
  };
  addUserVisible = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private washPackageService: WashPackageService,
    private addOnService: AddOnService,
    private userService: UserService,
    private washRequestService: WashRequestService,
    private washerWashRequestService: WasherwashrequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    const roles = this.user?.roles || [];

    this.isAdmin = roles.includes('Admin');
    this.isWasher = roles.includes('Washer');
    this.isCustomer = roles.includes('Customer');

    if (this.isWasher) {
      this.fetchAvailableWashRequest();
      this.loadAssignedRequests();
    }
    if (this.isCustomer) this.fetchCurrentWashRequest();
    if (this.isAdmin) {
      this.loadPendingWashRequests();
      this.loadWashPackages();
      this.loadAllUsers();
      this.loadAddOns();
    }
  }

  // --- Role-based Dashboard ---

  // Customers
  fetchCurrentWashRequest() {
    this.washRequestService.getWashRequest().subscribe({
      next: (data) => (this.currentWashRequest = data),
      error: () => console.log('No active wash request.'),
    });
  }

  confirmCancel(washRequest: any) {
  const confirmed = confirm('Are you sure you want to cancel this wash request?');
  if (!confirmed) return;

  this.washRequestService.cancelWashRequest(washRequest.washRequestID).subscribe({
    next: () => {
      alert('Wash request cancelled.');
      this.fetchCurrentWashRequest(); // Refresh list
    },
    error: (err) => {
      console.error('Cancel failed', err);
      alert('Failed to cancel request.');
    },
  });
}


  // Washers
fetchAvailableWashRequest() {
  this.washerWashRequestService.getAvailableWashRequest().subscribe({
    next: (data) => {
      console.log('Data:', data);
      this.washerWashRequest = data;
    },
    error: (err) => {
      console.error('Error details:', {
        status: err.status,
        message: err.message,
        error: err.error,
        errorText: typeof err.error === 'string' ? err.error.substring(0, 500) : err.error,
      });
    }
  });
}

loadAssignedRequests() {
  this.washerWashRequestService.getAssignedRequests().subscribe({
    next: (res) => (this.assignedWashRequest = res),
    error: (err) => console.error('Failed to load assigned requests', err)
  });
}


  acceptWashRequest(washRequest: any) {
    const requestId = washRequest.washRequestID;
    this.washerWashRequestService.acceptWashRequest(requestId).subscribe({
      next: () => {
        // notif.readStatus = true;
        alert('Request accepted.');
      },
      error: (err) => console.error('Accept failed', err),
    });
  }

  rejectWashRequest(washRequest: any) {
    const requestId = washRequest.washRequestID;
    this.washerWashRequestService.rejectWashRequest(requestId).subscribe({
      next: () => {
        // notif.readStatus = true;
        alert('Request rejected.');
      },
      error: (err) => console.error('Reject failed', err),
    });
  }

  markAsRead(notif: any, event: Event) {
    event.preventDefault();
    this.notificationService.markAsRead(notif).subscribe({
      next: () => (notif.readStatus = true),
      error: (err) => console.error('Mark as read failed', err),
    });
  }

  // Admins
  loadPendingWashRequests() {
    this.authService.getPendingWashRequests().subscribe({
      next: (data) => (this.pendingWashRequests = data),
      error: (err) => console.error('Failed to load pending wash requests', err),
    });
  }

  approveRequest(request: any) {
    this.authService.approveWasherRequest(request.id).subscribe({
      next: () => {
        this.pendingWashRequests = this.pendingWashRequests.filter((r) => r.id !== request.id);
        alert('Wash request approved.');
      },
      error: (err) => alert('Failed to approve wash request: ' + err),
    });
  }

  rejectRequest(request: any) {
    this.authService.rejectWasherRequest(request.id).subscribe({
      next: () => {
        this.pendingWashRequests = this.pendingWashRequests.filter((r) => r.id !== request.id);
        alert('Wash request rejected.');
      },
      error: (err) => alert('Failed to reject wash request: ' + err),
    });
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => (this.groupedUsers = res),
      error: (err) => console.error('Failed to load users', err),
    });
  }

  get groupedRoles(): string[] {
    return Object.keys(this.groupedUsers);
  }

  addNewUser() {
    this.authService.addUserAsAdmin(this.newUser).subscribe({
      next: () => {
        alert('User added successfully!');
        this.addUserVisible = false;
        this.newUser = {
          name: '',
          email: '',
          password: '',
          contactInfo: '',
          profilePicture: '',
          role: 'Customer',
        };
        this.loadAllUsers();
      },
      error: (err) => alert('Failed to add user: ' + err.error),
    });
  }

  loadWashPackages() {
    this.washPackageService.getAllWashPackages().subscribe({
      next: (data) => (this.washPackages = data),
      error: (err) => console.error('Failed to load wash packages', err),
    });
  }

  addWashPackage() {
    this.washPackageService.createWashPackage(this.newPackage).subscribe({
      next: (createdPackage) => {
        this.washPackages.push(createdPackage);
        this.newPackage = { packageName: '', description: '', price: 0 };
        this.showAddPackage = false;
      },
      error: (err) => console.error('Failed to create package:', err),
    });
  }

  loadAddOns() {
    this.addOnService.getAllAddOns().subscribe((data: AddOn[]) => {
      this.addOns = data;
    });
  }

  addAddOn() {
    this.addOnService.createAddOn(this.newAddOn).subscribe({
      next: () => {
        this.loadAddOns();
        this.newAddOn = { name: '', description: '', price: 0 };
        this.showAddAddOn = false;
      },
      error: () => alert('Failed to add AddOn'),
    });
  }

  // Profile
  updateProfile() {
    this.authService.updateProfile(this.user).subscribe({
      next: () => alert('Profile updated successfully.'),
      error: (err) => console.error('Profile update failed', err),
    });
  }

  changePassword() {
    this.authService.changePassword(this.passwordData).subscribe({
      next: () => alert('Password updated successfully.'),
      error: (err) => console.error('Password change failed', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
