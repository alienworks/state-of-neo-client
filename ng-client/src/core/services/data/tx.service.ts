import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as CONST from './../../common/constants';

@Injectable()
export class TxService {
    constructor(private http: Http) { }

    getPage(page: number = 1, pageSize: number = 10, blockHash: string = null, address: string = null) {
        let url = `${CONST.BASE_URL}/api/transactions/list?page=${page}&pageSize=${pageSize}`;
        if (blockHash) { url += `&blockHash=${blockHash}`; }
        if (address) { url += `&address=${address}`; }

        return this.http.get(url);
    }

    get(hash: string) {
        return this.http.get(`${CONST.BASE_URL}/api/transactions/get/${hash}`);
    }

    getTotalGasClaimed() {
        return this.http.get(`${CONST.BASE_URL}/api/transactions/totalclaimed`);
    }
}

