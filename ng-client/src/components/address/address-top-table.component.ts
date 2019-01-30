import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { AddressService } from '../../core/services/data';
import { AddressListModel } from '../../models';

@Component({
    selector: 'app-address-top-table',
    templateUrl: `./address-top-table.component.html`
})
export class AddressTopTableComponent implements OnChanges {
    @Input() model: AddressListModel[];
    isLoading: boolean;

    constructor(private addressService: AddressService) {
        this.isLoading = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model.currentValue) {
            this.isLoading = false;
        }
    }

    getBalance(balances: any[], name: string) {
        return balances == null
            ? 0
            : balances.find(x => x.name === name) == null
                ? 0
                : balances.find(x => x.name === name).balance;
    }
}
