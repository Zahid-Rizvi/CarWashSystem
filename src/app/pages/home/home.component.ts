import { Component } from '@angular/core';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/notification.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent,FooterComponent,CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public authService: AuthService, private notificationService: NotificationService) {}

  unreadCount: number = 0;
  showNotifications = false;
  notifications: any[] = [];

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.fetchNotifications();
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

fetchNotifications() {
  this.notificationService.getUserNotifications().subscribe((data) => {
    this.notifications = data.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    this.unreadCount = this.notifications.filter(n => !n.readStatus).length;
  });
}

markAsRead(notif: any) {
  this.notificationService.markAsRead(notif.notificationID).subscribe({
    next: () => {
      notif.readStatus = true;
      this.unreadCount--; // Decrement on read
    },
    error: (err) => console.error('Mark as read failed', err)
  });
}

// acceptWashRequest(notif: any) {
//   const requestId = notif.relatedEntityId;
//   this.notificationService.acceptWashRequest(requestId).subscribe({
//     next: () => {
//       notif.readStatus = true;
//       this.unreadCount--;
//       alert('Request accepted.');
//     },
//     error: (err) => console.error('Accept failed', err)
//   });
// }

// rejectWashRequest(notif: any) {
//   const requestId = notif.relatedEntityId;
//   this.notificationService.rejectWashRequest(requestId).subscribe({
//     next: () => {
//       notif.readStatus = true;
//       this.unreadCount--;
//       alert('Request rejected.');
//     },
//     error: (err) => console.error('Reject failed', err)
//   });
// }


}
