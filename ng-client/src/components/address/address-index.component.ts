import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../core/services/data';
import { AddressListModel } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    templateUrl: './address-index.component.html'
})
export class AddressIndexComponent implements OnInit {
    activeAddresses: PageResultModel<AddressListModel>;
    topNeo: AddressListModel[];
    topGas: AddressListModel[];

    constructor(private addresses: AddressService) {
    }

    ngOnInit(): void {
        this.getPage(1);
        this.getTopAddresses();
    }

    getPage(page: number): void {
        this.addresses.getAddressesPage(page, 16)
            .subscribe(x => {
                this.activeAddresses = x.json() as PageResultModel<AddressListModel>;
                console.log(this.activeAddresses);
            }, err => {
                console.log(err);
            });
    }

    getTopAddresses() {        
        this.addresses.getTopNeo()
            .subscribe(x => {
                this.topNeo = x.json() as AddressListModel[];
                console.log(this.topNeo);
            }, err => {
                console.log(err);
            });

        this.addresses.getTopGas()
            .subscribe(x => {
                this.topGas = x.json() as AddressListModel[];
                console.log(this.topGas);
            }, err => {
                console.log(err);
            });
    }
}
