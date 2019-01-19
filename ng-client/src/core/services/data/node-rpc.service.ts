import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RpcService {
    constructor(private http: HttpClient) { }

    callMethod(address: string, method: string, version: number, params: any[] = []): any {
        const request = {
            'jsonrpc': '2.0',
            'method': method,
            'params': params,
            'id': version
        };

        return this.http.post(address, JSON.stringify(request));
    }
}
