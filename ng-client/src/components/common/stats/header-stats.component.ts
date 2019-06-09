import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';

import { NodeService } from 'src/core/services/data';
import { CommonStateService } from 'src/core/services';
import { HeaderInfoModel } from 'src/models';
import { StatsSignalRService, PeersSignalRService } from 'src/core/services/signal-r';

import * as CONST from 'src/core/common/constants';
import { BaseComponent } from 'src/components/base/base.component';

declare var $;

@Component({
    selector: `app-header-stats`,
    templateUrl: './header-stats.component.html',
    styleUrls: ['./header-stats.component.css']
})
export class HeaderStatsComponent extends BaseComponent implements OnDestroy, OnInit {
    secondsSinceLastBlock = 0;
    headerInfo: HeaderInfoModel;
    rpcNodes = 0;
    consensusNodes = 0;

    totalPeersFound: number;
    totalPeersTracked: number;

    headerUpdate = new EventEmitter<HeaderInfoModel>();
    totalPeersFoundUpdate = new EventEmitter<number>();
    totalPeersTrackedUpdate = new EventEmitter<number>();

    constructor(
        private statsSrService: StatsSignalRService,
        private state: CommonStateService,
        private peersHub: PeersSignalRService,
        private nodeService: NodeService) {
        super();
    }

    ngOnInit(): void {
        this.subscribeToEvents();

        this.addSubsctiption(
            setInterval(() => {
                if (this.headerInfo != null) {
                    if (this.headerInfo.createdOn != null) {
                        const now = new Date().getTime();
                        const then = new Date(this.headerInfo.createdOn).getTime();
                        this.secondsSinceLastBlock = Math.floor((now - then) / 1000);
                    }
                }
            }, 1000)
        );
    }
    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    private subscribeToEvents(): void {
        this.statsSrService.registerAdditionalEvent('header', this.headerUpdate);
        this.addSubsctiption(
            this.headerUpdate.subscribe((x: HeaderInfoModel) => {
                this.headerInfo = x;
                this.updateBestBlock();
            })
        );

        this.peersHub.registerAdditionalEvent('total-tracked', this.totalPeersTrackedUpdate);
        this.addSubsctiption(
            this.totalPeersTrackedUpdate.subscribe((x: number) => {
                this.totalPeersTracked = x
            })
        );
        
        this.addSubsctiption(
            this.peersHub.connectionEstablished.subscribe(x => {
                if (x) {
                    this.peersHub.invokeOnServerEvent('InitInfo', 'caller');
                }
            })
        );

        if (this.peersHub.connectionIsEstablished) {
            this.peersHub.invokeOnServerEvent('InitInfo', 'caller');
        }
        
        this.nodeService.getConsensusNodes()
            .subscribe(x => {
                const result = x as Array<any>;
                this.consensusNodes = result.filter((y: any) => y.Active).length;
            });
    }

    private updateBestBlock(): void {
        $('#last-block-icon').addClass('fa-spin');
        $('#last-block-icon').css('animation-play-state', 'running');
        setTimeout(() => $('#last-block-icon').css('animation-play-state', 'paused'), 2080);
    }
}
