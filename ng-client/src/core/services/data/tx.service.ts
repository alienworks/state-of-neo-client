import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as CONST from './../../common/constants';
import { UnitOfTime, PageResultModel, BaseTxModel, TxDetailsModel, TxAssetsModel } from '../../../models';
import { RpcService } from './node-rpc.service';

@Injectable()
export class TxService {
    constructor(private http: HttpClient, private rpc: RpcService) { }

    getPage(page: number = 1,
        pageSize: number = 10,
        blockHash: string = null,
        address: string = null,
        asset: string = null,
        type: string = null) {

        let url = `${CONST.BASE_URL}/api/transactions/list?page=${page}&pageSize=${pageSize}`;
        if (blockHash) {
            url += `&blockHash=${blockHash}`;
        }

        if (address) {
            url += `&address=${address}`;
        }

        if (asset) {
            url += `&asset=${asset}`;
        }

        if (type || type === '0') {
            url += `&type=${type}`;
        }

        return this.http.get<PageResultModel<BaseTxModel>>(url);
    }

    get(hash: string) {
        return this.http.get<TxDetailsModel>(`${CONST.BASE_URL}/api/transactions/get/${hash}`);
    }

    getAssets(hash: string) {
        return this.http.get<TxAssetsModel>(`${CONST.BASE_URL}/api/transactions/getassets/${hash}`);
    }

    getUnconfirmed(url: string, hash: string) {
        return this.rpc.callMethod(url, 'getrawtransaction', 1, [hash, 1]);
    }

    getTotalGasClaimed() {
        return this.http.get<number>(`${CONST.BASE_URL}/api/transactions/totalclaimed`);
    }

    total(): any {
        return this.http.get<number>(`${CONST.BASE_URL}/api/transactions/total`);
    }
}

