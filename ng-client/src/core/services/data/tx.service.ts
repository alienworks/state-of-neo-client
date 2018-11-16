import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as CONST from './../../common/constants';
import { UnitOfTime } from '../../../models';
import { RpcService } from './node-rpc.service';

@Injectable()
export class TxService {
    constructor(private http: Http, private rpc: RpcService) { }

    getPage(page: number = 1, pageSize: number = 10, blockHash: string = null, address: string = null, asset: string = null) {
        let url = `${CONST.BASE_URL}/api/transactions/list?page=${page}&pageSize=${pageSize}`;
        if (blockHash) { url += `&blockHash=${blockHash}`; }
        if (address) { url += `&address=${address}`; }
        if (asset) { url += `&asset=${asset}`; }
        console.log(url);
        return this.http.get(url);
    }

    get(hash: string) {
        return this.http.get(`${CONST.BASE_URL}/api/transactions/get/${hash}`);
    }

    getAssets(hash: string) {
        return this.http.get(`${CONST.BASE_URL}/api/transactions/getassets/${hash}`);
    }

    getUnconfirmed(url: string, hash: string) {
        return this.rpc.callMethod(url, 'getrawtransaction', 1, [hash, 1]);
    }

    getTotalGasClaimed() {
        return this.http.get(`${CONST.BASE_URL}/api/transactions/totalclaimed`);
    }

    total(): any {
        return this.http.get(`${CONST.BASE_URL}/api/transactions/total`);
    }

    averagePer(unit: UnitOfTime): any {
        return this.http.get(`${CONST.BASE_URL}/api/transactions/averageper?unit=${unit}`);
    }
}

