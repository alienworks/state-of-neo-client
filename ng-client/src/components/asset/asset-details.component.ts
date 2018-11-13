import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetService, TxService } from '../../core/services/data';
import { AssetDetailsModel } from '../../models';
import { BaseTxModel } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    templateUrl: `./asset-details.component.html`
})
export class AssetDetailsComponent implements OnInit {
    isLoading: boolean;
    hash: string;
    model: AssetDetailsModel = new AssetDetailsModel();
    transactions: PageResultModel<BaseTxModel>;

    constructor(private route: ActivatedRoute,
        private assets: AssetService,
        private txService: TxService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.hash = params['hash'];

            this.getTransactionsPage(1);

            this.isLoading = true;
            this.assets.getAsset(this.hash)
                .subscribe(x => {
                    this.isLoading = false;
                    this.model = x.json() as AssetDetailsModel;

                    console.log(this.model);
                });
        });
    }

    getTransactionsPage(page: number) {
        this.txService.getPage(page, 10, null, null, this.hash)
            .subscribe(x => {
                this.transactions = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
