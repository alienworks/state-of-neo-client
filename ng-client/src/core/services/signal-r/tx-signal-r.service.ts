import { Injectable } from '@angular/core';
import { SignalRService } from './signal-r.service';

import * as CONST from '../../common/constants';

@Injectable()
export class TransactionSignalRService extends SignalRService {

    constructor() {
        super();
        this.createConnection(`${CONST.BASE_URL}/hubs/tx`);
        this.startConnection();
    }
}
