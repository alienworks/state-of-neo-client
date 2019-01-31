import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { NotificationsSignalRService } from 'src/core/services/signal-r';
import { CommonStateService } from 'src/core/services';
import { NotificationModel } from 'src/models';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: './notifications-index.component.html'
})
export class NotificationsIndexComponent extends BaseComponent implements OnInit, OnDestroy {
    notifications: NotificationModel[];
    contract: string;
    contractFilter = false;
    isConsoleView = false;

    constructor(
        private state: CommonStateService,
        private notificationsSignalR: NotificationsSignalRService) {
        super();
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    ngOnInit(): void {
        this.state.changeRoute('notifications');

        this.addSubsctiption(
            this.notificationsSignalR.allNotificationsReceive.subscribe((x: NotificationModel[]) => {
                if (!this.contractFilter) this.notifications = x;
            })
        );

        this.addSubsctiption(
            this.notificationsSignalR.contractNotificationUpdate.subscribe((x: NotificationModel[]) => {
                if (this.contractFilter) this.notifications = x;
            })
        );

        this.addSubsctiption(
            this.notificationsSignalR.connectionEstablished.subscribe((x: boolean) => {
                if (x) {
                    this.notificationsSignalR.invokeOnServerEvent('InitInfo', 'all');
                }
            })
        );

        if (this.notificationsSignalR.connectionIsEstablished) {
            this.notificationsSignalR.invokeOnServerEvent('InitInfo', 'all');
        }
    }

    subscribeToContract(hash: string) {
        this.contract = hash;
        this.notificationsSignalR.invokeOnServerEvent('TrackContract', hash);
        this.contractFilter = true;
    }

    unsubscribeToContract() {
        this.notificationsSignalR.invokeOnServerEvent('Unsubscribe', this.contract);
        this.contractFilter = false;
        this.contract = null;
    }

    changeView() {
        this.isConsoleView = !this.isConsoleView;
    }
}
