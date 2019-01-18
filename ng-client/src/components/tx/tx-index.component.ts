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
    type: string = '';
    txTypes: any = [
        { label: 'All', value: '' },
        { label: 'Miner', value: '0' },
        { label: 'Issue', value: '1' },
        { label: 'Claim', value: '2' },
        { label: 'Enroll', value: '32' },
        { label: 'Register', value: '64' },
        { label: 'Contract', value: '128' },
        { label: 'State', value: '144' },
        { label: 'Publish', value: '208' },
        { label: 'Invocation', value: '209' },
        
    ];
    page: number = 1;
    pageSize: number = 16;

    constructor(
        private txService: TxService,
        private state: CommonStateService,
        private statsSrService: StatsSignalRService) { }

    ngOnInit() {
        this.state.changeRoute('transactions');

        this.getPage(this.page);

        this.statsSrService.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.totalClaimedUpdate.subscribe((x: number) => {
            return this.claimedGas = x;
        });

        this.statsSrService.invokeOnServerEvent(`InitInfo`, 'caller');
    }

    getPage(page: number): void {
        console.log(this.type);
        this.txService.getPage(page, this.pageSize, null, null, null, this.type)
            .subscribe(x => {
                this.transactions = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
