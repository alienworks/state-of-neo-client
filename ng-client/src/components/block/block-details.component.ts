import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockService } from '../../core/services/data';
import { BlockDetailsModel } from '../../models/block.models';

@Component({
    templateUrl: `./block-details.component.html`
})
export class BlockDetailsComponent implements OnInit {
    index: string | number;
    block: BlockDetailsModel = new BlockDetailsModel();

    constructor(private route: ActivatedRoute,
        private _blockService: BlockService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.index = +params['index'];
            this._blockService.getBlock(this.index)
                .subscribe(x => {
                    this.block = x.json() as BlockDetailsModel;
                });
        });
    }
}
