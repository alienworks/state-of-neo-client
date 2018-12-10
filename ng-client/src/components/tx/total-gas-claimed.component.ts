import { Component, OnInit } from '@angular/core';
import { TxService } from '../../core/services/data';
import { StatsSignalRService } from '../../core/services/signal-r';

@Component({
    selector: 'app-total-gas-claimed',
    templateUrl: './total-gas-claimed.component.html'
})
export class TotalGasClaimedComponent implements OnInit {
    isLoading = true;
    total: number;
    constructor(private txService: TxService, private statsRsService: StatsSignalRService) { }

    ngOnInit(): void {
        this.txService.getTotalGasClaimed()
            .subscribe(x => {
                this.total = x.json() as number;
                this.isLoading = false;
            }, err => console.log(err));

        this.statsRsService.totalClaimedUpdate
            .subscribe(x => this.total = x);
    }
}
