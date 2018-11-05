import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TxService } from '../../core/services/data';
import { TxDetailsModel, TxTypeEnum, AssetTypeEnum } from '../../models';

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
        if (this.tx === null) { return ''; }
        return TxTypeEnum[this.tx.type];
    }

    getAssetName(value: number): string {
        return AssetTypeEnum[value];
    }
}
