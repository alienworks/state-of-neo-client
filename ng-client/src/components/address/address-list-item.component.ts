import { Component, Input } from '@angular/core';
import { AddressListModel } from '../../models';

@Component({
    selector: 'app-address-list-item',
    templateUrl: `./address-list-item.component.html`
})
export class AddressListItemComponent {
    @Input() address: AddressListModel;

    getBalance(balances: any[], name: string) {
        return balances == null 
            ? 0 
            : balances.find(x => x.name == name) == null 
                ? 0 
                : balances.find(x => x.name == name).balance;
    }
}