import { Component, OnInit, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { BlockService } from 'src/core/services/data';
import { BlockListModel } from 'src/models/block.models';
import { trigger, transition, style, animate } from '@angular/animations';
import { StatsSignalRService } from 'src/core/services/signal-r';
import { HeaderInfoModel } from 'src/models';
import { BaseComponent } from './base/base.component';

declare var $;

@Component({
    selector: `app-home-block`,
    templateUrl: `./home-block.component.html`,
    styleUrls: [
        './home-block.component.css'
    ],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('.5s ease-in', style({ opacity: '1' }))
            ])
        ])
    ]
})
export class HomeBlockComponent extends BaseComponent implements OnInit, OnDestroy {
    blocks: BlockListModel[] = [];
    headerUpdate = new EventEmitter<HeaderInfoModel>();

    private itemClass = 'home-block-container';

    constructor(private blocksService: BlockService, private stats: StatsSignalRService) { super(); }

    ngOnInit(): void {
        this.blocksService.getBlocksPage(1, 20)
            .subscribe(x => {
                this.blocks = x.items;

                this.stats.registerAdditionalEvent('header', this.headerUpdate);
                this.addSubscription(
                    this.headerUpdate.subscribe((header: HeaderInfoModel) => {
                        if (this.blocks.findIndex(b => b.height === header.height) === -1) {
                            const newBlock = new BlockListModel();
                            newBlock.hash = header.hash;
                            newBlock.height = header.height;
                            newBlock.transactionsCount = header.transactionCount;
                            newBlock.timestamp = header.timestamp;
                            newBlock.timeInSeconds = header.timeInSeconds;
                            newBlock.collectedFees = header.collectedFees;
                            newBlock.size = header.size;
                            newBlock.validator = header.validator;

                            this.blocks.pop();
                            this.blocks.unshift(newBlock);
                        }
                    })
                );
            }, err => console.log(err));
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }
}
