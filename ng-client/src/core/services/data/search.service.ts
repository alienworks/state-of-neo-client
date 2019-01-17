import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as CONST from '../../common/constants';

@Injectable()
export class SearchService {
    constructor(private http: Http) { }

    public find(input: string) {
        return this.http.get(`${CONST.BASE_URL}/api/search/find/${input}`);
    }
}
