import { Component, OnInit, EventEmitter } from '@angular/core';
import { AddressService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { AddressListModel } from '../../models';
import { PageResultModel } from '../../models';
import { StatsSignalRService } from 'src/core/services/signal-r';

@Component({
    templateUrl: './address-index.component.html'
})
export class AddressIndexComponent implements OnInit {
    activeAddresses: PageResultModel<AddressListModel>;
    topNeo: AddressListModel[];
    topGas: AddressListModel[];

    totalCount: number;
    totalCountUpdate = new EventEmitter<number>();

    constructor(private addresses: AddressService,
        private state: CommonStateService,
        private statsService: StatsSignalRService) {
    }

    ngOnInit(): void {
        this.state.changeRoute('addresses');

        this.getPage(1);
        this.getTopAddresses();
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this.statsService.registerAdditionalEvent('address-count', this.totalCountUpdate);
        this.totalCountUpdate.subscribe((x: number) => this.totalCount);
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
