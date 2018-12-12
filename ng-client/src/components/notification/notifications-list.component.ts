import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationModel } from 'src/models';

@Component({
    selector: 'app-not-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent {
    @Input() notifications: NotificationModel[];
    @Input() title = 'ALL';
    @Output() contractFilter = new EventEmitter<string>();

    filter(hash: string): void {
        this.contractFilter.emit(hash);
    }
}
