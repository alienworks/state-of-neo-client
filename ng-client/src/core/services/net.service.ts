import { Injectable, EventEmitter } from '@angular/core';

import * as CONST from './../common/constants';

@Injectable()
export class NetService {
    net: string;
    netChanged = new EventEmitter<string>();

    constructor() {
        this.net = CONST.BASE_URL;
    }

    changeNet(newSetup: string): void {
        this.net = newSetup;
        this.netChanged.emit(this.net);
    }
}
