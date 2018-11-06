import { Component, OnInit, Input } from '@angular/core';
import { AddressService } from '../../core/services/data';
import { AddressListModel } from '../../models';

@Component({
    selector: 'app-address-top',
    templateUrl: `./address-top.component.html`
})
export class AddressTopComponent implements OnInit {
    isLoadingNeo: boolean;
    isLoadingGas: boolean;
    topNeo: AddressListModel[];
    topGas: AddressListModel[];

    constructor(private addressService: AddressService) { }

    ngOnInit(): void {
        this.isLoadingNeo = true;
        this.addressService.getTopNeo()
            .subscribe(x => {
                this.topNeo = x.json() as AddressListModel[];
                this.isLoadingNeo = false;
                console.log(this.topNeo);
            }, err => {
                this.isLoadingNeo = false;
                console.log(err);
            });

        this.isLoadingGas = true;
        this.addressService.getTopGas()
            .subscribe(x => {
                this.topGas = x.json() as AddressListModel[];
                this.isLoadingGas = false;
                console.log(this.topGas);
            }, err => {
                this.isLoadingGas = false;
                console.log(err);
            });
    }
}
