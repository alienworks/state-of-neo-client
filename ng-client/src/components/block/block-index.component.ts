import { Component, OnInit, EventEmitter } from '@angular/core';
import { BlockService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { StatsSignalRService } from '../../core/services/signal-r';
import { BlockListModel } from '../../models/block.models';
import { PageResultModel, HeaderInfoModel } from '../../models';

@Component({
    templateUrl: './block-index.component.html'
})
export class BlockIndexComponent implements OnInit {
    blocks: PageResultModel<BlockListModel>;
    page = 1;
    headerUpdate = new EventEmitter<HeaderInfoModel>();

    constructor(
        private blockService: BlockService,
        private state: CommonStateService,
        private stats: StatsSignalRService
    ) { }

    ngOnInit(): void {
        this.state.changeRoute('blocks');

        this.getPage(this.page);

        this.stats.registerAdditionalEvent('header', this.headerUpdate);
        this.headerUpdate.subscribe((x: HeaderInfoModel) => {
            if (this.blocks.items.findIndex(b => b.height === x.height) === -1) {
                const newBlock = new BlockListModel();
                newBlock.hash = x.hash;
                newBlock.height = x.height;
                newBlock.transactionsCount = x.transactionCount;
                newBlock.timestamp = x.timestamp;
                newBlock.timeInSeconds = x.timeInSeconds;
                newBlock.collectedFees = x.collectedFees;
                newBlock.size = x.size;
                newBlock.validatorAddress = x.validatorAddress;

                this.blocks.items.pop();
                this.blocks.items.unshift(newBlock);
            }
        });
    }

    getPage(page: number): void {
        this.blockService.getBlocksPage(page, 32)
            .subscribe(x => {
                this.blocks = x.json() as PageResultModel<BlockListModel>;
            }, err => {
                console.log(err);
            });
    }
}
