import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { AddressDetailsModel, BaseTxModel } from '../../models';
import { PageResultModel } from '../../models';
import { TxService } from '../../core/services/data';

@Component({
    templateUrl: `./address-details.component.html`
})
export class AddressDetailsComponent implements OnInit {
    isLoading: boolean;
    address: string;
    addressDetails: AddressDetailsModel = new AddressDetailsModel();
    transactions: PageResultModel<BaseTxModel>;

    constructor(private route: ActivatedRoute,
        private addressService: AddressService,
        private state: CommonStateService,
        private txService: TxService) { }

    ngOnInit(): void {
        this.state.changeRoute('address');

        this.route.params.subscribe(params => {
            this.address = params['address'];

            this.getTransactionsPage(1);

            this.isLoading = true;
            this.addressService.getAddress(this.address)
                .subscribe(x => {
                    this.isLoading = false;
                    this.addressDetails = x.json() as AddressDetailsModel;

                    console.log(this.addressDetails);
                });
        });
    }

    get transactionsEndpoint() {
        return 'address/TransactionsChart/' + this.address;
    }

    get globalBalances() {
        return this.addressDetails.balances == null
            ? []
            : this.addressDetails.balances.filter(x => x.name !== 'NEO' && x.name !== 'GAS' && x.name !== 'GAS');
    }

    get nepFiveTokens() {
        return this.addressDetails.balances == null
            ? []
            : this.addressDetails.balances.filter(x => x.name !== 'NEO' && x.name !== 'GAS' && x.name !== 'GAS');
    }

    getBalance(name: string) {
        return this.addressDetails.balances == null
            ? 0
            : this.addressDetails.balances.find(x => x.name === name) == null
                ? 0
                : this.addressDetails.balances.find(x => x.name === name).balance;
    }

    get tokens() {
        return this.addressDetails.balances == null
            ? []
            : this.addressDetails.balances.filter(x => x.name !== 'NEO' && x.name !== 'GAS');
    }

    getTransactionsPage(page: number): void {
        this.txService.getPage(page, 10, null, this.address)
            .subscribe(x => {
                this.transactions = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
