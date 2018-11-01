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
    pageResults: PageResultModel<BaseTxModel>;

    constructor(private _txService: TxService) { }

    ngOnInit(): void {
        this.getPage(1);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getPage(1);
    }

    getPage(page: number): void {
        this._txService.getPage(page, this.pageSize, this.blockHash)
            .subscribe(x => {
                this.pageResults = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
