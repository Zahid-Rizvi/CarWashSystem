import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../core/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user = this.authService.currentUserValue;
  activeTab: string = 'profile';
  profileImage: string = 'assets/Profile.png';
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  acceptRequest(notification: Notification) {
    const requestId = notification.relatedEntityId;
    this.notificationService.acceptWashRequest(requestId).subscribe({
      next: () => {
        this.markAsRead(notification, new MouseEvent('click')); // optional
        this.loadNotifications();
      },
      error: (err) => console.error('Accept failed', err)
    });
  }
  
  rejectRequest(notification: Notification) {
    const requestId = notification.relatedEntityId;
    this.notificationService.rejectWashRequest(requestId).subscribe({
      next: () => {
        this.markAsRead(notification, new MouseEvent('click'));
        this.loadNotifications();
      },
      error: (err) => console.error('Reject failed', err)
    });
  }
  
  
  loadNotifications() {
    this.notificationService.getUserNotifications().subscribe((data) => {
      this.notifications = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      this.unreadCount = this.notifications.filter(n => !n.readStatus).length;
    });
  }

  markAsRead(notification: Notification, event: MouseEvent) {
    event.stopPropagation(); // Prevent closing dropdown
    this.notificationService.markAsRead(notification.notificationID).subscribe(() => {
      notification.readStatus = true;
      this.unreadCount = this.notifications.filter(n => !n.readStatus).length;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
