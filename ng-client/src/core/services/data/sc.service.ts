import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmartContractListModel, SmartContractDetailsModel, PageResultModel, BaseTxModel } from 'src/models';

import * as CONST from '../../common/constants';

@Injectable()
export class SmartContractService {
    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<SmartContractListModel[]>(`${CONST.BASE_URL}/api/smartcontract/getall`);
    }

    public get(hash: string) {
        return this.http.get<SmartContractDetailsModel>(`${CONST.BASE_URL}/api/smartcontract/get/${hash}`);
    }

    public getTransactionsPage(hash: string, page: number, pageSize: number) {
        return this.http.get<PageResultModel<BaseTxModel>>(
            `${CONST.BASE_URL}/api/smartcontract/InvocationTransactions/${hash}/${page}/${pageSize}`
        );
    }
}
