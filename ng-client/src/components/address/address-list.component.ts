import { Component, OnInit, Input } from '@angular/core';
import { AddressService } from '../../core/services/data';
import { AddressListModel } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    selector: 'app-address-list',
    templateUrl: `./address-list.component.html`
})
export class AddressListComponent implements OnInit {
    @Input() pageSize: number;
    isLoading: boolean;
    pageResults: PageResultModel<AddressListModel>;

    constructor(private addressService: AddressService) { }

    ngOnInit(): void {
        this.getPage(1);
    }

    getPage(page: number): void {
        this.isLoading = true;
        this.addressService.getAddressesPage(page, this.pageSize)
            .subscribe(x => {
                this.pageResults = x;
                this.isLoading = false;
                console.log(this.pageResults);
            }, err => {
                this.isLoading = false;
                console.log(err);
            });
    }
}
