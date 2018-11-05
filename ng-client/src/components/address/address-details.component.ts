import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from '../../core/services/data';
import { AddressDetailsModel, BaseTxModel } from '../../models';

@Component({
    templateUrl: `./address-details.component.html`
})
export class AddressDetailsComponent implements OnInit {
    isLoading: boolean;
    address: string;
    addressDetails: AddressDetailsModel = new AddressDetailsModel();
    transactions: BaseTxModel[];

    constructor(private route: ActivatedRoute,
        private addressService: AddressService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.address = params['address'];

            this.isLoading = true;
            this.addressService.getAddress(this.address)
                .subscribe(x => {
                    this.isLoading = false;
                    this.addressDetails = x.json() as AddressDetailsModel;

                    console.log(this.addressDetails);
                });
        });
    }

    getBalance(name: string) {
        return this.addressDetails.balances == null 
            ? 0 
            : this.addressDetails.balances.find(x => x.name == name) == null 
                ? 0 
                : this.addressDetails.balances.find(x => x.name == name).balance;
    }

    getTokens() {
        return this.addressDetails.balances == null
            ? []
            : this.addressDetails.balances.filter(x => x.name != 'NEO' && x.name != 'GAS');
    }
}
