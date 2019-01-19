import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { AddressListModel } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    selector: 'app-address-list-table',
    templateUrl: `./address-list-table.component.html`
})
export class AddressListTableComponent implements OnChanges  {
    @Input() pageResults: PageResultModel<AddressListModel>;
    @Output() emitGetPage: EventEmitter<any> = new EventEmitter();
    isLoading: boolean;

    constructor() {
        this.isLoading = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pageResults.currentValue) {
            this.isLoading = false;
        }
    }

    getBalance(balances: any[], name: string) {
        return balances == null 
            ? 0 
            : balances.find(x => x.name == name) == null 
                ? 0 
                : balances.find(x => x.name == name).balance;
    }

    getPage(page: number) {
        this.isLoading = true;
        this.emitGetPage.emit(page);
    }
}
