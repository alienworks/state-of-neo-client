import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AddressService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { AddressListModel } from '../../models';
import { PageResultModel } from '../../models';
import { StatsSignalRService } from 'src/core/services/signal-r';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: './address-index.component.html'
})
export class AddressIndexComponent extends BaseComponent implements OnInit, OnDestroy {
    activeAddresses: PageResultModel<AddressListModel>;
    topNeo: AddressListModel[];
    topGas: AddressListModel[];

    totalCount: number;
    totalCountUpdate = new EventEmitter<number>();
    totalCountSub: any;

    constructor(private addresses: AddressService,
        private state: CommonStateService,
        private statsService: StatsSignalRService) {
        super();
    }

    ngOnInit(): void {
        this.state.changeRoute('addresses');

        this.getPage(1);
        this.getTopAddresses();
        this.subscribeToEvents();
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    private subscribeToEvents(): void {
        this.statsService.registerAdditionalEvent('address-count', this.totalCountUpdate);
        this.addSubscription(this.totalCountUpdate.subscribe((x: number) => this.totalCount = x));

        this.statsService.invokeOnServerEvent(`InitInfo`, 'caller');
    }

    getPage(page: number): void {
        this.addresses.getAddressesPage(page, 32)
            .subscribe(x => {
                this.activeAddresses = x;
            }, err => {
                console.log(err);
            });
    }

    getTopAddresses() {
        this.addresses.getTopNeo()
            .subscribe(x => {
                this.topNeo = x;
            }, err => {
                console.log(err);
            });

        this.addresses.getTopGas()
            .subscribe(x => {
                this.topGas = x;
            }, err => {
                console.log(err);
            });
    }
}
