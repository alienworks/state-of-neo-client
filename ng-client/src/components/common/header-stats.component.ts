import { Component } from '@angular/core';
import { BlockService } from 'src/core/services/block.service';

declare var $;

@Component({
    selector: `app-header-stats`,
    templateUrl: './header-stats.component.html'
})
export class HeaderStatsComponent {
    secondsSinceLastBlock: number = 0;
    bestBlock: number = 0;

    constructor(private _blockService: BlockService) {
        this.subscribeToEvents();

        setInterval(() => this.secondsSinceLastBlock++, 1000);
    }

    private subscribeToEvents(): void {
        this._blockService.BestBlockChanged.subscribe((block: number) => {
            this.bestBlock = block;
            this.updateBestBlock(this.bestBlock);
        });
    }

    private updateBestBlock(height: number): void {
        $('#last-block-icon').addClass('fa-spin');
        $('#last-block-icon').css('animation-play-state', 'running');
        setTimeout(() => $('#last-block-icon').css('animation-play-state', 'paused'), 2080);
    }
}