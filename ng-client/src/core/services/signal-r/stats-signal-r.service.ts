import { Injectable, EventEmitter } from '@angular/core';
import { SignalRService } from './signal-r.service';

import * as CONST from 'src/core/common/constants';

@Injectable({
    providedIn: 'root'
})
export class StatsSignalRService extends SignalRService {
    txCountUpdate = new EventEmitter<number>();
    addressCountUpdate = new EventEmitter<number>();
    assetsCountUpdate = new EventEmitter<number>();
    headerUpdate = new EventEmitter<any>();

    constructor() {
        super();
        this.createConnection(`${CONST.BASE_URL}/hubs/stats`);
        // this.registerOnServerEvents();
        this.subscribeEvents();
        this.startConnection();
    }

    private subscribeEvents() {
        this.registerAdditionalEvent('tx-count', this.txCountUpdate);
        this.registerAdditionalEvent('address-count', this.addressCountUpdate);
        this.registerAdditionalEvent('assets-count', this.assetsCountUpdate);
        this.registerAdditionalEvent('header', this.headerUpdate);
    }
}