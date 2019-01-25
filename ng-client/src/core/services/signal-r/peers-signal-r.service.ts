import { Injectable } from '@angular/core';

import * as CONST from '../../common/constants';
import { SignalRService } from './signal-r.service';

@Injectable()
export class PeersSignalRService extends SignalRService {

    constructor() {
        super();
        this.createConnection(`${CONST.BASE_URL}/hubs/peers`);
        this.startConnection();
    }
}
