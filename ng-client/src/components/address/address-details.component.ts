import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { AddressDetailsModel, BaseTxModel } from '../../models';
import { PageResultModel } from '../../models';
import { TxService } from '../../core/services/data';
import { BaseComponent } from '../base/base.component';
import * as constants from "../../core/common/constants";

@Component({
    templateUrl: `./address-details.component.html`
})
export class AddressDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
    public transactions: PageResultModel<BaseTxModel>;
    isLoading: boolean;
    address: string;
    addressDetails: AddressDetailsModel = new AddressDetailsModel();
    routeSubscibe: any;

    constructor(
        private route: ActivatedRoute,
        private addressService: AddressService,
        private state: CommonStateService,
        private txService: TxService) {
        super();
    }

    ngOnInit(): void {
        this.state.changeRoute('address');

        this.addSubsctiption(this.route.params.subscribe(params => {
            this.address = params['address'];

            this.getTransactionsPage(1);

            this.isLoading = true;
            this.addressService.getAddress(this.address)
                .subscribe(x => {
                    this.isLoading = false;
                    this.addressDetails = x;
                });
        }));
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    get transactionsEndpoint() {
        return 'address/TransactionsChart/' + this.address;
    }

    get globalBalances() {
        return this.addressDetails.balances == null
            ? []
            : this.addressDetails.balances.filter(x => x.assetType !== 'NEP5');
    }

    get tokens() {
        return this.addressDetails.balances == null
            ? []
            : this.addressDetails.balances.filter(x => x.assetType === 'NEP5');
    }

    get tokenEnums() {
      return constants.Assets;
    }

    getTransactionsPage(page: number): void {
        this.txService.getPage(page, 10, null, this.address)
            .subscribe(x => {
                this.transactions = x;
            }, err => {
                console.log(err);
            });
    }
}
