import { Component, OnInit, EventEmitter } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';
import { TxService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { StatsSignalRService } from 'src/core/services/signal-r';

@Component({
    templateUrl: './tx-index.component.html'
})
export class TxIndexComponent implements OnInit {
    transactions: PageResultModel<BaseTxModel>;
    count: number;
    claimedGas: number;
    totalClaimedUpdate = new EventEmitter<number>();

    constructor(
        private txService: TxService,
        private state: CommonStateService,
        private statsSrService: StatsSignalRService) { }

    ngOnInit() {
        this.state.changeRoute('transactions');

        this.getPage(1);

        this.statsSrService.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.totalClaimedUpdate.subscribe((x: number) => {
            return this.claimedGas = x;
        });

        this.statsSrService.invokeOnServerEvent(`InitInfo`, 'caller');
    }

    getPage(page: number): void {
        this.txService.getPage(page, 14)
            .subscribe(x => {
                this.transactions = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
