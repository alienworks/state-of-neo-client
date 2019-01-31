import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';
import { TxService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { StatsSignalRService, TransactionSignalRService } from 'src/core/services/signal-r';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: './tx-index.component.html'
})
export class TxIndexComponent extends BaseComponent implements OnInit, OnDestroy {
    transactions: PageResultModel<BaseTxModel>;
    count: number;
    claimedGas: number;
    totalClaimedUpdate = new EventEmitter<number>();
    type = '';
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
        { label: 'Invocation', value: '209' }
    ];
    page = 1;
    pageSize = 16;
    newTransactionsEvent = new EventEmitter<BaseTxModel[]>();

    constructor(
        private txService: TxService,
        private state: CommonStateService,
        private statsSrService: StatsSignalRService,
        private txSignalRService: TransactionSignalRService) {
        super();
    }

    ngOnInit() {
        this.state.changeRoute('transactions');

        this.getPage(this.page);

        this.statsSrService.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.addSubsctiption(
            this.totalClaimedUpdate.subscribe((x: number) => {
                return this.claimedGas = x;
            })
        );

        this.addSubsctiption(
            this.statsSrService.connectionEstablished.subscribe((x: boolean) => {
                if (x) {
                    this.statsSrService.invokeOnServerEvent(`InitInfo`, 'caller');
                }
            })
        );

        if (this.statsSrService.connectionIsEstablished) {
            this.statsSrService.invokeOnServerEvent(`InitInfo`, 'caller');
        }

        this.txSignalRService.registerAdditionalEvent('new', this.newTransactionsEvent);
        this.addSubsctiption(
            this.newTransactionsEvent.subscribe((x: BaseTxModel[]) => {
                if (x.length < this.pageSize) {
                    for (const iterator of x) {
                        this.transactions.items.pop();
                    }
                    for (const tx of x) {
                        this.transactions.items.unshift(tx);
                    }
                } else {
                    this.transactions.items = x;
                }
            })
        );

        this.addSubsctiption(
            this.txSignalRService.connectionEstablished.subscribe((x: boolean) => {
                if (x) {
                    this.txSignalRService.invokeOnServerEvent('InitInfo', 'caller');
                }
            })
        );

        if (this.txSignalRService.connectionIsEstablished) {
            this.txSignalRService.invokeOnServerEvent('InitInfo', 'caller');
        }
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    getPage(page: number): void {
        console.log(this.type);
        this.txService.getPage(page, this.pageSize, null, null, null, this.type)
            .subscribe(x => {
                this.transactions = x;
            }, err => {
                console.log(err);
            });
    }
}
