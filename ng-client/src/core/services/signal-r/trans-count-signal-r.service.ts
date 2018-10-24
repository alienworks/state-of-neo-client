import { EventEmitter, Injectable } from '@angular/core';
import { SignalRService } from './signal-r.service';

@Injectable()
export class TransCountSignalRService extends SignalRService {
    averageReceived = new EventEmitter<string>();

    public init(connection: string) {
        super.init(connection);
        this.registerAdditionalEvent('Average', this.averageReceived);
    }
}
