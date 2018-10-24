import { Component } from '@angular/core';

import { TransAvgCountSignalRService } from '../../core/services/signal-r/trans-avg-count-signal-r.service';

import * as CONST from './../../core/common/constants';

@Component({
    selector: `app-footer-stats`,
    templateUrl: './footer-stats.component.html'
})
export class FooterStatsComponent {
    txAvCount: number;
    blocksCountStart: number = Date.now();
    blocksCounted: 0;

    constructor(private _transAvgCountService: TransAvgCountSignalRService) {
        this._transAvgCountService.init(`${CONST.BASE_URL}/hubs/trans-average-count`);
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this._transAvgCountService.messageReceived.subscribe((avCount: number) => {
            this.txAvCount = avCount;
        });
    }

    private getAverageBlockTime() {
        const now = Date.now();
        const elapsed = (now - this.blocksCountStart) / 1000;

        return Math.round(elapsed / this.blocksCounted);
    }
}
