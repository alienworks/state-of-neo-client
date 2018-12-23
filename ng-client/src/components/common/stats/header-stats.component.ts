import { Component, EventEmitter } from '@angular/core';

import { NodeService } from 'src/core/services/data';
import { HeaderInfoModel } from 'src/models';
import { StatsSignalRService } from 'src/core/services/signal-r';

import * as CONST from 'src/core/common/constants';

declare var $;

@Component({
    selector: `app-header-stats`,
    templateUrl: './header-stats.component.html',
    styleUrls: ['./header-stats.component.css']
})
export class HeaderStatsComponent {
    secondsSinceLastBlock = 0;
    headerInfo: HeaderInfoModel;
    rpcNodes: number = 0;
    consensusNodes: number = 0;

    headerUpdate = new EventEmitter<HeaderInfoModel>();

    constructor(
        private statsSrService: StatsSignalRService,
        private nodeService: NodeService) {
        this.subscribeToEvents();

        setInterval(() => {
            if (this.headerInfo != null) {
                if (this.headerInfo.createdOn != null) {
                    const now = new Date().getTime();
                    const then = new Date(this.headerInfo.createdOn).getTime();
                    this.secondsSinceLastBlock = Math.floor((now - then) / 1000);
                }
            }
        }, 1000);
    }

    private subscribeToEvents(): void {
        this.statsSrService.registerAdditionalEvent('header', this.headerUpdate);
        this.headerUpdate.subscribe((x: HeaderInfoModel) => {
            this.headerInfo = x;
            this.updateBestBlock();
        });

        
        this.nodeService.rpcEnabledNodes.subscribe(x => this.rpcNodes = x);

        this.nodeService.getConsensusNodes()
            .subscribe(x => {
                var result = x.json() as Array<any>;
                this.consensusNodes = result.filter(x => x.Active).length;
            });
    }

    private updateBestBlock(): void {
        $('#last-block-icon').addClass('fa-spin');
        $('#last-block-icon').css('animation-play-state', 'running');
        setTimeout(() => $('#last-block-icon').css('animation-play-state', 'paused'), 2080);
    }
}
