import { Injectable, EventEmitter } from '@angular/core';

import { NodeService } from './node.service';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import * as CONST from '../../common/constants';
import { AssetTypeEnum, UnitOfTime, PageResultModel, AssetListModel, AssetDetailsModel } from '../../../models';

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    public bestBlock = 0;
    public bestBlockChanged = new EventEmitter<number>();

    constructor(
        private http: HttpClient,
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

    public getAssetsPage(page: number = 1, pageSize: number = 10, global: boolean = true) {
        return this.http.get<PageResultModel<AssetListModel>>(`${CONST.BASE_URL}/api/assets/list?page=${page}&pageSize=${pageSize}&global=${global}`);
    }

    public getAssetAddressCount(hash: string, unitOfTime: UnitOfTime = UnitOfTime.None, active: boolean = false) {
        return this.http.get<number>(`${CONST.BASE_URL}/api/assets/addressescount?hash=${hash}&unitOfTime=${unitOfTime}&active=${active}`);
    }

    public getAsset(hash: string) {
        return this.http.get<AssetDetailsModel>(`${CONST.BASE_URL}/api/assets/get/${hash}`);
    }

    public getChartData() {
        return this.http.post(`${CONST.BASE_URL}/api/assets/chart`, {
            unitOfTime: 1
        });
    }

    public getAssetCount(type: AssetTypeEnum[]) {
        return this.http.post<number>(`${CONST.BASE_URL}/api/assets/count`, type);
    }

    public getAssetTxCount(type: AssetTypeEnum[]) {
        return this.http.post<number>(`${CONST.BASE_URL}/api/assets/txcount`, type);
    }
}
