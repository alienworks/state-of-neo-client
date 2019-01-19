import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResultModel } from '../../../models/common.models';

import * as CONST from '../../common/constants';

@Injectable()
export class SearchService {
    constructor(private http: HttpClient) { }

    public find(input: string) {
        return this.http.get<SearchResultModel>(`${CONST.BASE_URL}/api/search/find/${input}`);
    }
}
