import { Component, OnInit } from '@angular/core';
import { NotificationsSignalRService } from 'src/core/services/signal-r';
import { NotificationModel } from 'src/models';

@Component({
    templateUrl: './notifications-index.component.html'
})
export class NotificationsIndexComponent implements OnInit {
    allNotifications: NotificationModel[];
    contract: string;

    constructor(private notificationsSignalR: NotificationsSignalRService) {
        this.subscribeToEvents();
    }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    private subscribeToEvents(): void {
        this.notificationsSignalR.allNotificationsReceive.subscribe((x: NotificationModel[]) => {
            this.allNotifications = x;
            console.log(this.allNotifications);
        });
    }

    subscribeToContract() {
        alert(this.contract);
    }
}
