import { Component, OnInit } from '@angular/core';
import { BlockService } from '../../core/services/data/block.service';

@Component({
    templateUrl: `./block-list.component.html`
})
export class BlockListComponent implements OnInit {
    blocks: any[] = [];

    constructor(private _blockService: BlockService) { }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
