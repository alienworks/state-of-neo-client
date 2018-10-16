import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { DYNAMIC_TYPE } from '@angular/compiler/src/output/output_ast';

import { SignalRService } from 'src/core/services/signal-r.service';
import { NodesSignalRService } from 'src/core/services/nodes-signal-r.service';
import { BlocksSignalRService } from 'src/core/services/blocks-signal-r.service';
import { NodeRpcService } from 'src/core/services/node-rpc.service';
import { TransCountSignalRService } from 'src/core/services/trans-count-signal-r.service';
import { TransAvgCountSignalRService } from 'src/core/services/trans-avg-count-signal-r.service';
import { FailP2PSignalRService } from 'src/core/services/fail-p2p-signal-r.service';

import { NodeService } from 'src/core/services/node.service';

import * as CONST from '../core/common/constants';

declare var $;
declare var jvm;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

}
