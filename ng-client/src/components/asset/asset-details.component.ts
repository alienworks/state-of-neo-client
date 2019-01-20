import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetService, TxService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { BaseTxModel, AssetDetailsModel, UnitOfTime } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    templateUrl: `./asset-details.component.html`,
    styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {
    isLoading: boolean;
    hash: string;
    model: AssetDetailsModel = new AssetDetailsModel();
    transactions: PageResultModel<BaseTxModel>;

    totalAddressCount: number;
    activeAddressesLastMonth: number;
    newAddressesLastMonth: number;

    constructor(private route: ActivatedRoute,
        private assets: AssetService,
        private txService: TxService,
        private state: CommonStateService) { }

    ngOnInit(): void {
        this.state.changeRoute('asset');

        this.route.params.subscribe(params => {
            this.hash = params['hash'];

            this.getTransactionsPage(1);

            this.isLoading = true;
            this.assets.getAsset(this.hash)
                .subscribe(x => {
                    this.isLoading = false;
                    this.model = x;

                    this.assets.getAssetAddressCount(this.hash).subscribe(count => {
                        this.totalAddressCount = count;
                    }, err => console.log(err));

                    this.assets.getAssetAddressCount(this.hash, UnitOfTime.Month, true).subscribe(count => {
                        this.activeAddressesLastMonth = count;
                        console.log('activeAddressesLastMonth = ' + this.activeAddressesLastMonth);
                    }, err => console.log(err));

                    this.assets.getAssetAddressCount(this.hash, UnitOfTime.Month).subscribe(count => {
                        this.newAddressesLastMonth = count;
                    }, err => console.log(err));

                    console.log(this.model);
                });
        });
    }

    getTransactionsPage(page: number) {
        this.txService.getPage(page, 10, null, null, this.hash)
            .subscribe(x => {
                this.transactions = x;
            }, err => {
                console.log(err);
            });
    }
}
