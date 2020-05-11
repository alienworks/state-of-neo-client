import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { BlockService, TxService, AddressService, AssetService } from 'src/core/services/data';
import { UnitOfTime, AssetTypeEnum } from '../../../models';
import { StatsSignalRService } from 'src/core/services/signal-r';

import * as CONST from './../../../core/common/constants';
import { BaseComponent } from 'src/components/base/base.component';

@Component({
    selector: `app-footer-stats`,
    templateUrl: './footer-stats.component.html',
    styleUrls: ['./footer-stats.component.css']
})
export class FooterStatsComponent extends BaseComponent implements OnInit, OnDestroy {
    // Blocks
    // Propertiess
    serverBlockCount: number;
    latestBlock: number;
    avgSize: number;
    avgTxCount: number;
    avgTime: number;
    // Events
    blocksCountUpdate = new EventEmitter<number>();
    blocksTotalTimeCountUpdate = new EventEmitter<number>();
    blocksTotalSizeCountUpdate = new EventEmitter<number>();

    // TX
    // Properties
    totalTx: number;
    claimedGas: number;
    avgPerSecond: number;
    avgPerDay: number;
    // Events
    txCountUpdate = new EventEmitter<number>();
    totalClaimedUpdate = new EventEmitter<number>();

    // Addresses
    // Properties
    totalAddressCount: number;
    lastActiveAddresses: number;
    addrCreatedLastDay: number;
    addrCreatedLastMonth: number;
    // Events
    addressCountUpdate = new EventEmitter<number>();

    // Assets
    // Properties
    totalAssetCount: number;
    neoAndGasTxCount: number;
    nep5Assets = -1;
    nep5AssetTxCount = -1;
    // Events
    assetsCountUpdate = new EventEmitter<number>();
    neoGasTxCountUpdate = new EventEmitter<number>();
    nep5TxCountUpdate = new EventEmitter<number>();

    constructor(private blockService: BlockService,
        private txService: TxService,
        private addrService: AddressService,
        private assetService: AssetService,
        private statsSrService: StatsSignalRService) {
        super();
    }

    ngOnInit(): void {
        this.subscribeToEvents();
        console.log('DAYS', this.daysSinceFirstBlock());

        // Blocks
        this.statsSrService.registerAdditionalEvent('total-block-count', this.blocksCountUpdate);
        this.statsSrService.registerAdditionalEvent('total-block-time', this.blocksTotalTimeCountUpdate);
        this.statsSrService.registerAdditionalEvent('total-block-size', this.blocksTotalSizeCountUpdate);

        this.addSubscription(
            this.blocksCountUpdate.subscribe((x: number) => {
                this.serverBlockCount = x;
                if (!this.latestBlock) this.latestBlock = this.serverBlockCount;
                this.avgTxCount = this.totalTx / this.serverBlockCount;
            })
        );
        this.addSubscription(
            this.blocksTotalTimeCountUpdate.subscribe((x: number) => this.avgTime = x / this.serverBlockCount)
        );
        this.addSubscription(
            this.blocksTotalSizeCountUpdate.subscribe((x: number) => {
                this.avgSize = x / this.serverBlockCount;
            })
        );

        // Txs
        this.statsSrService.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.addSubscription(
            this.totalClaimedUpdate.subscribe(x => this.claimedGas = x)
        );

        this.statsSrService.registerAdditionalEvent('tx-count', this.txCountUpdate);
        this.addSubscription(
            this.txCountUpdate.subscribe(x => {
                this.totalTx = x;
                this.avgTxCount = this.totalTx / this.serverBlockCount;
                this.avgPerSecond = this.totalTx / this.secondsSinceFirstBlock();
                this.avgPerDay = this.totalTx / this.daysSinceFirstBlock();
            })
        );

        // Addresses
        this.statsSrService.registerAdditionalEvent('address-count', this.addressCountUpdate);
        this.addSubscription(
            this.addressCountUpdate.subscribe((x: number) => this.totalAddressCount = x)
        );

        this.addrService.getActive()
            .subscribe(x => this.lastActiveAddresses = x);
        this.addrService.getCreatedLast(UnitOfTime.Day)
            .subscribe(x => this.addrCreatedLastDay = x);
        this.addrService.getCreatedLast(UnitOfTime.Month)
            .subscribe(x => this.addrCreatedLastMonth = x);

        // Assets
        this.assetService.getAssetCount([AssetTypeEnum.NEP5])
            .subscribe(x => this.nep5Assets = x);

        this.statsSrService.registerAdditionalEvent('assets-count', this.assetsCountUpdate);
        this.addSubscription(
            this.assetsCountUpdate.subscribe((x: number) => this.totalAssetCount = x)
        );
        this.statsSrService.registerAdditionalEvent('gas-neo-tx-count', this.neoGasTxCountUpdate);
        this.addSubscription(
            this.neoGasTxCountUpdate.subscribe((x: number) => this.neoAndGasTxCount = x)
        );
        this.statsSrService.registerAdditionalEvent('nep-5-tx-count', this.nep5TxCountUpdate);
        this.addSubscription(
            this.nep5TxCountUpdate.subscribe((x: number) => this.nep5AssetTxCount = x)
        );

        this.statsSrService.invokeOnServerEvent(`InitInfo`, 'arg');
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    private subscribeToEvents() {
        this.addSubscription(
            this.blockService.bestBlockChanged.subscribe((x: number) => {
                this.latestBlock = x;
            })
        );
    }

    private daysSinceFirstBlock(): number {
        return this.calculateTimeBetweenDates(new Date(), CONST.FirstBlockTime, CONST.DayInMs);
    }

    private secondsSinceFirstBlock(): number {
        return this.calculateTimeBetweenDates(new Date(), CONST.FirstBlockTime, CONST.SecondInMs);
    }

    private calculateTimeBetweenDates(date1: Date, date2: Date, msUnitOfValue: number) {
        // Convert both dates to milliseconds
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        const difference_ms = date1_ms - date2_ms;

        // Convert back to days/secodns
        return Math.round(difference_ms / msUnitOfValue);
    }
}
