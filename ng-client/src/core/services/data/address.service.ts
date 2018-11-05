import { Injectable, EventEmitter } from '@angular/core';

import { NodeService } from './node.service';
import { Http } from '@angular/http';

import * as CONST from '../../common/constants';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
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

    public getAddressesPage(page: number = 1, pageSize: number = 10) {
        return this.http.get(`${CONST.BASE_URL}/api/address/list?page=${page}&pageSize=${pageSize}`);
    }

    public getAddress(address: string) {
        return this.http.get(`${CONST.BASE_URL}/api/address/get/${address}`);
    }

    public getChartData() {
        return this.http.post(`${CONST.BASE_URL}/api/address/chart`, {
            unitOfTime: 1
        });
    }
}
