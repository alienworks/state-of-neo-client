import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';
import { TxService } from '../../core/services/data';

@Component({
    selector: 'app-tx-list',
    templateUrl: `./tx-list.component.html`
})
export class TxListComponent implements OnInit, OnChanges {
    @Input() blockHash: string;
    @Input() pageSize = 10;
    @Input() address: string = null;
    pageResults: PageResultModel<BaseTxModel>;

    constructor(private _txService: TxService) { }

    ngOnInit(): void {
        // this.getPage(1);
    }

    ngOnChanges(change: SimpleChanges): void {
        console.log(change);
        if (change.blockHash) {
            if (change.blockHash.currentValue != change.blockHash.previousValue || change.blockHash.isFirstChange) {
                this.getPage(1);
            }
        }

        if (change.address) {
            if (change.address.currentValue != change.address.previousValue || change.address.isFirstChange) {
                this.getPage(1);
            }
        }

        if (change.pageSize) {
            if (change.pageSize.currentValue != change.pageSize.previousValue || change.pageSize.isFirstChange) {
                this.getPage(1);
            }
        }
    }

    getPage(page: number): void {
        this._txService.getPage(page, this.pageSize, this.blockHash, this.address)
            .subscribe(x => {
                this.pageResults = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
