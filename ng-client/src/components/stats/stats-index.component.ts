import { Component, OnInit, EventEmitter } from '@angular/core';
import { CommonStateService } from '../../core/services';
import { StatsSignalRService } from '../../core/services/signal-r';
import { BlockService, AddressService, AssetService, NodeService } from '../../core/services/data';
import { UnitOfTime, AssetTypeEnum, HeaderInfoModel } from 'src/models';
import * as CONST from '../../core/common/constants';

@Component({
    templateUrl: './stats-index.component.html',
    styleUrls: [
        './stats-index.component.css'
    ]
})
export class StatsIndexComponent implements OnInit {
    headerUpdate = new EventEmitter<HeaderInfoModel>();
    consensusNodes: number = 0;

    // Block
    serverBlockCount: number;
    latestBlock: number = 0;
    averageBlockSize: number = 0;
    averageBlockTime: number = 0;
    averageTransactionsPerBlock: number = 0;    
    blocksCountUpdate = new EventEmitter<number>();
    blocksTotalTimeCountUpdate = new EventEmitter<number>();
    blocksTotalSizeCountUpdate = new EventEmitter<number>();

    // TX
    totalTransactions: number;
    claimedGas: number;
    averageTxPerSecond: number;
    averageTxPerDay: number;
    txCountUpdate = new EventEmitter<number>();
    totalClaimedUpdate = new EventEmitter<number>();

    // Addresses
    totalAddresses: number;
    lastActiveAddresses: number;
    addressesCreatedLastDay: number;
    addressesCreatedLastMonth: number;
    addressCountUpdate = new EventEmitter<number>();

    // Assets
    totalAssets: number;
    neoAndGasTxCount: number;
    nep5Assets = -1;
    nep5AssetTxCount = -1;
    assetsCountUpdate = new EventEmitter<number>();
    neoGasTxCountUpdate = new EventEmitter<number>();
    nep5TxCountUpdate = new EventEmitter<number>();

    constructor(
        private nodeService: NodeService,
        private state: CommonStateService,
        private statsSignalR: StatsSignalRService,
        private blocks: BlockService,        
        private addrService: AddressService,
        private assetService: AssetService
    ) { }

    ngOnInit() {
        this.state.changeRoute('stats');
        this.subscribeToEvents();

        // Blocks
        // this.statsSignalR.registerAdditionalEvent('total-block-count', this.blocksCountUpdate);
        this.statsSignalR.registerAdditionalEvent('total-block-time', this.blocksTotalTimeCountUpdate);
        this.statsSignalR.registerAdditionalEvent('total-block-size', this.blocksTotalSizeCountUpdate);
        this.statsSignalR.registerAdditionalEvent('header', this.headerUpdate);

        this.headerUpdate.subscribe((x: HeaderInfoModel) => this.serverBlockCount = x.height);

        // this.blocksCountUpdate.subscribe((x: number) => {
        //     this.serverBlockCount = x;

        //     if (!this.latestBlock) {
        //          this.latestBlock = this.serverBlockCount;
        //     }

        //     this.averageTransactionsPerBlock = this.totalTransactions / this.serverBlockCount;
        // });

        this.blocksTotalTimeCountUpdate.subscribe((x: number) => this.averageBlockTime = x / this.serverBlockCount);
        this.blocksTotalSizeCountUpdate.subscribe((x: number) => this.averageBlockSize = x / this.serverBlockCount);

        // Txs
        this.statsSignalR.registerAdditionalEvent('total-claimed', this.totalClaimedUpdate);
        this.totalClaimedUpdate.subscribe(x => this.claimedGas = x);

        this.statsSignalR.registerAdditionalEvent('tx-count', this.txCountUpdate);
        this.txCountUpdate.subscribe(x => {
            this.totalTransactions = x;
            this.averageTransactionsPerBlock = this.totalTransactions / this.serverBlockCount;
            this.averageTxPerSecond = this.totalTransactions / this.secondsSinceFirstBlock();
            this.averageTxPerDay = this.totalTransactions / this.daysSinceFirstBlock();
        });

        // Addresses
        this.statsSignalR.registerAdditionalEvent('address-count', this.addressCountUpdate);
        this.addressCountUpdate.subscribe((x: number) => this.totalAddresses = x);

        this.addrService.getActive().subscribe(x => this.lastActiveAddresses = x);
        this.addrService.getCreatedLast(UnitOfTime.Day).subscribe(x => this.addressesCreatedLastDay = x);
        this.addrService.getCreatedLast(UnitOfTime.Month).subscribe(x => this.addressesCreatedLastMonth = x);

        // Assets
        this.assetService.getAssetCount([AssetTypeEnum.NEP5]).subscribe(x => this.nep5Assets = x);

        this.statsSignalR.registerAdditionalEvent('assets-count', this.assetsCountUpdate);
        this.assetsCountUpdate.subscribe((x: number) => this.totalAssets = x);
        this.statsSignalR.registerAdditionalEvent('gas-neo-tx-count', this.neoGasTxCountUpdate);
        this.neoGasTxCountUpdate.subscribe((x: number) => this.neoAndGasTxCount = x);
        this.statsSignalR.registerAdditionalEvent('nep-5-tx-count', this.nep5TxCountUpdate);
        this.nep5TxCountUpdate.subscribe((x: number) => this.nep5AssetTxCount = x);

        this.statsSignalR.invokeOnServerEvent(`InitInfo`, 'arg');
    }

    private subscribeToEvents() {
        this.blocks.bestBlockChanged.subscribe((x: number) => this.latestBlock = x);

        this.nodeService.getConsensusNodes()
            .subscribe((x: Array<any>) => this.consensusNodes = x.filter((y: any) => y.Active).length);
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
