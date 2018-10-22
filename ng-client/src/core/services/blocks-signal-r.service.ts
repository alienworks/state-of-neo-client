import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { SignalRService } from './signal-r.service';
import { HeaderInfoModel } from '../../models';

@Injectable()
export class BlocksSignalRService extends SignalRService {

}
