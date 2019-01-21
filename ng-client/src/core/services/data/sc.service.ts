import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmartContractListModel } from 'src/models';

import * as CONST from '../../common/constants';

@Injectable()
export class SmartContractService {
    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<SmartContractListModel[]>(`${CONST.BASE_URL}/api/smartcontract/getall`);
    }
}
