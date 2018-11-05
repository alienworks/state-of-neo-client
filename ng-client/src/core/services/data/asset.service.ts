import { Injectable, EventEmitter } from '@angular/core';

import { NodeService } from './node.service';
import { Http } from '@angular/http';

import * as CONST from '../../common/constants';

@Injectable({
    providedIn: 'root'
})
export class AssetService {
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

    public getAssetsPage(page: number = 1, pageSize: number = 10) {
        return this.http.get(`${CONST.BASE_URL}/api/assets/list?page=${page}&pageSize=${pageSize}`);
    }

    public getAsset(hash: string) {
        return this.http.get(`${CONST.BASE_URL}/api/assets/get/${hash}`);
    }

    public getChartData() {
        return this.http.post(`${CONST.BASE_URL}/api/assets/chart`, {
            unitOfTime: 1
        });
    }
}
