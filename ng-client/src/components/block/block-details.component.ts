import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockService } from '../../core/services/data';
import { CommonStateService } from '../../core/services';
import { BlockDetailsModel } from '../../models/block.models';
import { PageResultModel, BaseTxModel } from '../../models';
import { TxService } from '../../core/services/data';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: `./block-details.component.html`,
    styleUrls: ['./block-details.component.css']
})
export class BlockDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
    index: string | number;
    block: BlockDetailsModel = new BlockDetailsModel();
    isLoading = true;
    transactions: PageResultModel<BaseTxModel>;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private state: CommonStateService,
        private blockService: BlockService,
        private txService: TxService) {
        super();
    }

    ngOnInit(): void {
        this.state.changeRoute('block');

        this.isLoading = true;
        this.addSubscription(this.route.params.subscribe(params => {
            this.index = +params['index'];

            if (params['index'].startsWith('0x')) {
                this.index = params['index'];
            }

            this.blockService.getBlock(this.index)
                .subscribe(x => {
                    this.block = x;
                    this.getTransactionsPage(1);
                    this.isLoading = false;
                });
        }));
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    getTransactionsPage(page: number): void {
        this.txService.getPage(page, 16, this.block.hash)
            .subscribe(x => {
                this.transactions = x;
            }, err => {
                console.log(err);
            });
    }
}
