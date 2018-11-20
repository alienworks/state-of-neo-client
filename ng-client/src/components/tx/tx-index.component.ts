import { Component, OnInit } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';
import { TxService } from '../../core/services/data';

@Component({
    templateUrl: './tx-index.component.html'
})
export class TxIndexComponent implements OnInit {
    transactions: PageResultModel<BaseTxModel>;
    count: number;

    constructor(private txService: TxService) { }

    ngOnInit() {
        this.getPage(1);
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
