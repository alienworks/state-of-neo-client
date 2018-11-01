import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TxService } from '../../core/services/data';
import { TxDetailsModel, TxTypeEnum } from '../../models';

@Component({
    templateUrl: `./tx-details.component.html`
})
export class TxDetailsComponent implements OnInit {
    hash: string;
    tx: TxDetailsModel;

    constructor(private route: ActivatedRoute,
        private txService: TxService) { }

    ngOnInit(): void {
        this.hash = this.route.snapshot.paramMap.get('hash');

        this.txService.get(this.hash)
            .subscribe(x => {
                this.tx = x.json() as TxDetailsModel;
            }, err => {
                console.log(err);
            });
    }

    getTypeName(): string {
        return TxTypeEnum[this.tx.type];
    }
}
