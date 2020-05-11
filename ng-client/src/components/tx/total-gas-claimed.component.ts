import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { TxService } from '../../core/services/data';
import { StatsSignalRService } from '../../core/services/signal-r';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-total-gas-claimed',
    templateUrl: './total-gas-claimed.component.html'
})
export class TotalGasClaimedComponent extends BaseComponent implements OnInit, OnDestroy {
    isLoading = true;
    total: number;
    totalClaimedUpdate = new EventEmitter<number>();

    constructor(private txService: TxService, private statsRsService: StatsSignalRService) { super(); }

    ngOnInit(): void {

        this.txService.getTotalGasClaimed()
            .subscribe(x => {
                this.total = x;
                this.isLoading = false;
            }, err => console.log(err));

        this.statsRsService.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.addSubscription(this.totalClaimedUpdate.subscribe(x => this.total = x));

    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }
}
