import { Component, OnInit } from '@angular/core';
import { BlockService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { StatsSignalRService } from '../../core/services/signal-r';
import { BlockListModel } from '../../models/block.models';
import { PageResultModel } from '../../models';

@Component({
    templateUrl: './block-index.component.html'
})
export class BlockIndexComponent implements OnInit {
    blocks: PageResultModel<BlockListModel>;

    constructor(
        private blockService: BlockService,
        private state: CommonStateService,
        private stats: StatsSignalRService    
    ) { }

    ngOnInit(): void {
        this.state.changeRoute('blocks');

        this.getPage(1);
    }

    getPage(page: number): void {
        this.blockService.getBlocksPage(page, 16)
            .subscribe(x => {
                this.blocks = x.json() as PageResultModel<BlockListModel>;
            }, err => {
                console.log(err);
            });
    }

}