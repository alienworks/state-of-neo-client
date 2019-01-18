import { Component, OnInit } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';
import { TxService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';

@Component({
    templateUrl: './tx-index.component.html'
})
export class TxIndexComponent implements OnInit {
    transactions: PageResultModel<BaseTxModel>;
    count: number;
    type: string = null;
    txTypes: any = [
        { label: 'Miner', value: 0 },
        { label: 'Issue', value: 1 },
        { label: 'Claim', value: 2 },
        { label: 'Enroll', value: 32 },
        { label: 'Register', value: 64 },
        { label: 'Contract', value: 128 },
        { label: 'State', value: 144 },
        { label: 'Publish', value: 208 },
        { label: 'Invocation', value: 209 },
        
    ];
    page: number = 1;

    constructor(private txService: TxService,
        private state: CommonStateService
    ) { }

    ngOnInit() {
        this.state.changeRoute('transactions');

        this.getPage(this.page);
    }

    getPage(page: number): void {
        console.log(this.type);
        this.txService.getPage(page, 14, null, null, null, this.type)
            .subscribe(x => {
                this.transactions = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
