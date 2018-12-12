import { Injectable, EventEmitter } from '@angular/core';
import { SignalRService } from './signal-r.service';

import { NotificationModel } from 'src/models';

import * as CONST from '../../common/constants';

@Injectable()
export class NotificationsSignalRService extends SignalRService {
    allNotificationsReceive = new EventEmitter<NotificationModel>();
    contractNotificationUpdate = new EventEmitter<NotificationModel>();
    unsubscribed = new EventEmitter<string>();

    constructor() {
        super();
        this.createConnection(`${CONST.BASE_URL}/hubs/notification`);
        this.subscribeEvents();
        this.startConnection();
    }

    private subscribeEvents() {
        this.registerAdditionalEvent('all', this.allNotificationsReceive);
        this.registerAdditionalEvent('unsubscribed', this.allNotificationsReceive);
        this.registerAdditionalEvent('contract', this.contractNotificationUpdate);
    }
}
