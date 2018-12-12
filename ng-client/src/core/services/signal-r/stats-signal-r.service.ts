import { Injectable, EventEmitter } from '@angular/core';
import { SignalRService } from './signal-r.service';

import * as CONST from 'src/core/common/constants';

@Injectable()
export class StatsSignalRService extends SignalRService {
    txCountUpdate = new EventEmitter<number>();
    addressCountUpdate = new EventEmitter<number>();
    assetsCountUpdate = new EventEmitter<number>();
    totalClaimedUpdate = new EventEmitter<number>();
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
        this.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
    }
}
