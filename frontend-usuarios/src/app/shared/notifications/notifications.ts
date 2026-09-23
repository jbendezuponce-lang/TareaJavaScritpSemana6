import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.html',
})
export class Notifications {
  protected readonly notifications = inject(NotificationService);
}
