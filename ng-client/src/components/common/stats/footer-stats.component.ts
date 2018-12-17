import { Component, OnInit, EventEmitter } from '@angular/core';
import { BlockService, TxService, AddressService, AssetService } from 'src/core/services/data';
import { UnitOfTime, AssetTypeEnum } from '../../../models';
import { StatsSignalRService } from 'src/core/services/signal-r';

import * as CONST from './../../../core/common/constants';

@Component({
    selector: `app-footer-stats`,
    templateUrl: './footer-stats.component.html',
    styleUrls: ['./footer-stats.component.css']
})
export class FooterStatsComponent implements OnInit {
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

    constructor(private blockService: BlockService,
        private txService: TxService,
        private addrService: AddressService,
        private assetService: AssetService,
        private statsSrService: StatsSignalRService) { }

    ngOnInit(): void {
        this.subscribeToEvents();
        console.log('DAYS', this.daysSinceFirstBlock());

        // Blocks
        this.statsSrService.registerAdditionalEvent('total-block-count', this.blocksCountUpdate);
        this.statsSrService.registerAdditionalEvent('total-block-time', this.blocksTotalTimeCountUpdate);
        this.statsSrService.registerAdditionalEvent('total-block-size', this.blocksTotalSizeCountUpdate);

        this.blocksCountUpdate.subscribe((x: number) => {
            this.serverBlockCount = x;
            this.avgTxCount = this.totalTx / this.serverBlockCount;
        });
        this.blocksTotalTimeCountUpdate.subscribe((x: number) => this.avgTime = x / this.serverBlockCount);
        this.blocksTotalSizeCountUpdate.subscribe((x: number) => {
            this.avgSize = x / this.serverBlockCount;
        });

        // Txs
        this.statsSrService.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.totalClaimedUpdate.subscribe(x => this.claimedGas = x);

        this.statsSrService.registerAdditionalEvent('tx-count', this.txCountUpdate);
        this.txCountUpdate.subscribe(x => {
            this.totalTx = x;
            this.avgTxCount = this.totalTx / this.serverBlockCount;
            this.avgPerSecond = this.totalTx / this.secondsSinceFirstBlock();
            this.avgPerDay = this.totalTx / this.daysSinceFirstBlock();
        });

        // Addresses
        this.statsSrService.registerAdditionalEvent('address-count', this.addressCountUpdate);
        this.addressCountUpdate.subscribe(x => this.addressCountUpdate = x);

        this.addrService.getActive()
            .subscribe(x => this.lastActiveAddresses = x.json() as number);
        this.addrService.getCreatedLast(UnitOfTime.Day)
            .subscribe(x => this.addrCreatedLastDay = x.json() as number);
        this.addrService.getCreatedLast(UnitOfTime.Month)
            .subscribe(x => this.addrCreatedLastMonth = x.json() as number);

        // Assets
        this.statsSrService.registerAdditionalEvent('assets-count', this.assetsCountUpdate);
        this.assetsCountUpdate.subscribe(x => this.assetsCountUpdate = x);

        this.assetService.getAssetTxCount([AssetTypeEnum.GAS, AssetTypeEnum.NEO])
            .subscribe(x => this.neoAndGasTxCount = x.json() as number);
        this.assetService.getAssetCount([AssetTypeEnum.NEP5])
            .subscribe(x => this.nep5Assets = x.json() as number);
        this.assetService.getAssetTxCount([AssetTypeEnum.NEP5])
            .subscribe(x => this.nep5AssetTxCount = x.json() as number);
    }

    private subscribeToEvents() {
        this.blockService.bestBlockChanged.subscribe((x: number) => {
            this.latestBlock = x;
        });
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
