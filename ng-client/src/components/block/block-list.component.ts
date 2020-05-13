import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { BlockService } from '../../core/services/data/block.service';
import { CommonStateService } from '../../core/services/';
import { BlockListModel } from '../../models/block.models';
import { PageResultModel, HeaderInfoModel } from '../../models';
import { trigger, transition, style, animate } from '@angular/animations';
import { StatsSignalRService } from 'src/core/services/signal-r';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: `./block-list.component.html`,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('.5s ease-in', style({ opacity: '1' }))
            ])
        ])
    ]
})
export class BlockListComponent extends BaseComponent implements OnInit, OnDestroy {
    pageResults: PageResultModel<BlockListModel>;
    isLoading = true;
    headerUpdate = new EventEmitter<HeaderInfoModel>();

    constructor(
        private blockService: BlockService,
        private state: CommonStateService,
        private statsSrService: StatsSignalRService) {
        super();
    }

    ngOnInit(): void {
        this.state.changeRoute('blocks');
        this.getPage(1);

        this.statsSrService.registerAdditionalEvent('header', this.headerUpdate);
        this.addSubscription(
            this.headerUpdate.subscribe((x: HeaderInfoModel) => {
                if (this.pageResults.items.findIndex(b => b.height === x.height) === -1) {
                    const newBlock = new BlockListModel();
                    newBlock.height = x.height;
                    newBlock.transactionsCount = x.transactionCount;
                    newBlock.timestamp = x.timestamp;
                    newBlock.size = x.size;

                    this.pageResults.items.pop();
                    this.pageResults.items.unshift(newBlock);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    getPage(page: number): void {
        this.isLoading = true;
        this.blockService.getBlocksPage(page, 32)
            .subscribe(x => {
                this.pageResults = x;
                this.isLoading = false;
            }, err => {
                console.log(err);
            });
    }
}
