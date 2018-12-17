import { Injectable, EventEmitter } from '@angular/core';
import { SignalRService } from './signal-r.service';

import * as CONST from 'src/core/common/constants';

@Injectable()
export class StatsSignalRService extends SignalRService {
    constructor() {
        super();
        this.createConnection(`${CONST.BASE_URL}/hubs/stats`);
        this.startConnection();
    }
}
