import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { ChartFilterModel } from '../../../models';

import * as CONST from './../../common/constants';

@Injectable()
export class ChartService {
    constructor(private http: Http) { }

    getChart(endpoint: string, data: ChartFilterModel) {
        return this.http.post(`${CONST.BASE_URL}/api/${endpoint}`, data);
    }
}
