import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetService, TxService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { BaseTxModel, AssetDetailsModel, UnitOfTime } from '../../models';
import { PageResultModel } from '../../models';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: `./asset-details.component.html`,
    styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
    public model: AssetDetailsModel = new AssetDetailsModel();
    isLoading: boolean;
    hash: string;
    transactions: PageResultModel<BaseTxModel>;

    totalAddressCount: number;
    activeAddressesLastMonth: number;
    newAddressesLastMonth: number;
    routeSub: any;

    constructor(private route: ActivatedRoute,
        private assets: AssetService,
        private txService: TxService,
        private state: CommonStateService) {
            super();
         }

    ngOnInit(): void {
        this.state.changeRoute('asset');

        this.addSubscription(this.route.params.subscribe(params => {
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
        }));
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
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
