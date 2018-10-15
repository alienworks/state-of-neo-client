import { Injectable, OnInit, EventEmitter } from '@angular/core';

import { NodeService } from 'src/core/services/node.service';

@Injectable({
    providedIn: 'root'
})
export class BlockService implements OnInit {
    public bestBlock: number = 0;
    public BestBlockChanged = new EventEmitter<number>();

    constructor(private _nodeService: NodeService) { }

    ngOnInit(): void {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this._nodeService.NodeBlockInfo.subscribe((x: number) => {
            if (this.bestBlock < x) {
                this.bestBlock = x;
                this.BestBlockChanged.emit(this.bestBlock);
            }
        })
    }
}