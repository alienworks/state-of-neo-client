import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ChartFilterModel, ChartDataItemModel } from '../../../models';

import * as CONST from './../../common/constants';

@Injectable()
export class ChartService {
    constructor(private http: HttpClient) { }

    getChart(endpoint: string, data: ChartFilterModel) {
        return this.http.post<ChartDataItemModel[]>(`${CONST.BASE_URL}/api/${endpoint}`, data);
    }

    getChartGet(endpoint: string) {
        return this.http.get<ChartDataItemModel[]>(`${CONST.BASE_URL}/api/${endpoint}`);
    }
}
