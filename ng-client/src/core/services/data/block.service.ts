import { Injectable, EventEmitter } from '@angular/core';

import { NodeService } from './node.service';
import { Http } from '@angular/http';

import * as CONST from '../../common/constants';

@Injectable({
    providedIn: 'root'
})
export class BlockService {
    public bestBlock = 0;
    public bestBlockChanged = new EventEmitter<number>();

    constructor(
        private http: Http,
        private _nodeService: NodeService) {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this._nodeService.nodeBlockInfo.subscribe((x: number) => {
            if (this.bestBlock < x) {
                this.bestBlock = x;
                this.bestBlockChanged.emit(this.bestBlock);
            }
        });
    }

    public getBlocksPage(page: number = 1, pageSize: number = 10) {
        return this.http.get(`${CONST.BASE_URL}/api/block/list?page=${page}&pageSize=${pageSize}`);
    }

    public getBlock(input: string | number) {
        let type = 'byhash';
        if (typeof input === 'number') { type = 'byheight'; }
        return this.http.get(`${CONST.BASE_URL}/api/block/${type}/${input}`);
    }
}
