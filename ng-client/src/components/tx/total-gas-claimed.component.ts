import { Component, OnInit, EventEmitter } from '@angular/core';
import { TxService } from '../../core/services/data';
import { StatsSignalRService } from '../../core/services/signal-r';

@Component({
    selector: 'app-total-gas-claimed',
    templateUrl: './total-gas-claimed.component.html'
})
export class TotalGasClaimedComponent implements OnInit {
    isLoading = true;
    total: number;
    totalClaimedUpdate = new EventEmitter<number>();

    constructor(private txService: TxService, private statsRsService: StatsSignalRService) { }

    ngOnInit(): void {

        this.txService.getTotalGasClaimed()
            .subscribe(x => {
                this.total = x;
                this.isLoading = false;
            }, err => console.log(err));

        this.statsRsService.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.totalClaimedUpdate.subscribe(x => this.total = x);

    }
}
