import { Component, Input } from '@angular/core';
import { NotificationModel } from 'src/models';

@Component({
    selector: 'app-not-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent {
    @Input() notifications: NotificationModel[];
    @Input() title = 'ALL';
}
