import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { BlockService } from 'src/core/services/data';
import { BlockListModel } from 'src/models/block.models';
import { trigger, transition, style, animate } from '@angular/animations';
import { StatsSignalRService } from 'src/core/services/signal-r';
import { HeaderInfoModel } from 'src/models';

declare var $;

@Component({
    selector: `app-home-block`,
    templateUrl: `./home-block.component.html`,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('.5s ease-in', style({ opacity: '1' }))
            ])
        ])
    ]
})
export class HomeBlockComponent implements OnInit, AfterViewInit {
    blocks: BlockListModel[];
    headerUpdate = new EventEmitter<HeaderInfoModel>();

    private itemClass = 'home-block-container';

    constructor(private blocksService: BlockService, private stats: StatsSignalRService) { }

    ngOnInit(): void {
        this.blocksService.getBlocksPage(1, 10)
            .subscribe(x => {
                this.blocks = x.items;
                // setTimeout(() => {

                //     const elementInfoHeight = $($(`.home-block-container .block-info-card`)[0]).height();
                //     const elementDetailsHeight = $($(`.home-block-container .block-details-card`)[0]).height();

                //     const totalContainerHeight = 5 * (elementInfoHeight > elementDetailsHeight ? elementInfoHeight : elementDetailsHeight);
                //     $('.blocks-container').height(10 + totalContainerHeight).css('overflow-y', 'scroll');
                // }, 1000);
            }, err => console.log(err));

        this.stats.registerAdditionalEvent('header', this.headerUpdate);
        this.headerUpdate.subscribe((x: HeaderInfoModel) => {
            if (this.blocks.findIndex(b => b.height === x.height) === -1) {
                const newBlock = new BlockListModel();
                newBlock.hash = x.hash;
                newBlock.height = x.height;
                newBlock.transactionsCount = x.transactionCount;
                newBlock.timestamp = x.timestamp;
                newBlock.timeInSeconds = x.timeInSeconds;
                newBlock.collectedFees = x.collectedFees;
                newBlock.size = x.size;
                newBlock.validatorAddress = x.validatorAddress;

                this.blocks.pop();
                this.blocks.unshift(newBlock);
            }
        });
    }

    ngAfterViewInit() {
    }
}
