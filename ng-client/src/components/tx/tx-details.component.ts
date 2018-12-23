import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TxService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { TxDetailsModel, TxTypeEnum, AssetTypeEnum } from '../../models';

@Component({
    templateUrl: `./tx-details.component.html`
})
export class TxDetailsComponent implements OnInit {
    hash: string;
    tx: TxDetailsModel = new TxDetailsModel();
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private state: CommonStateService,
        private txService: TxService
    ) { }

    ngOnInit(): void {
        this.state.changeRoute('transaction');

        this.isLoading = true;
        this.hash = this.route.snapshot.paramMap.get('hash');

        this.txService.get(this.hash)
            .subscribe(x => {
                this.tx = x.json() as TxDetailsModel;
                this.isLoading = false;
                console.log(this.tx);
            }, err => {
                console.log(err);
            });
    }

    get incomingAssets() {
        return this.tx.globalIncomingAssets.sort(x => x.amount);
    }

    get outgoingAssets() {
        return this.tx.globalOutgoingAssets.sort(x => x.amount);
    }

    get tokenAssets() {
        return this.tx.assets.sort(x => x.amount);
    }

    getTypeName(): string {
        if (this.tx === null) { return ''; }
        return TxTypeEnum[this.tx.type].substr(0, TxTypeEnum[this.tx.type].indexOf('Transaction'));
    }

    getAssetName(value: number): string {
        return AssetTypeEnum[value];
    }
}
