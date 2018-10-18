import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { DYNAMIC_TYPE } from '@angular/compiler/src/output/output_ast';


import { NodeService } from 'src/core/services/node.service';

import * as CONST from '../core/common/constants';

declare var $;
declare var jvm;

@Component({
    selector: `app-home`,
    templateUrl: `./home.component.html`,
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    allNodes: any[] = [];

    constructor(
        private _http: Http,
        private _nodeService: NodeService
    ) {
        this.subscribeToEvents();

        setInterval(() => {
            this._nodeService.updateNodesData();
            this.allNodes = this._nodeService.getNodes();
        }, 5000);
    }

    get savedRpc() {
        return this.allNodes.filter(x => x.type == 'RPC');
    }

    get rpcEnabled() {
        return this.allNodes.filter(x => x.type == 'RPC' && x.rpcEnabled);
    }

    ngOnInit() {
        this.allNodes = this._nodeService.getNodes();
        
        // window height - header - body padding top and bottom
        let height = $(window).height() - 50 - 20 - 20;
        $('#nodes-panel').css('height', height + 'px');
        $('#main-panel').css('height', height + 'px');
    }

    private subscribeToEvents(): void {
        this._nodeService.updateNodes.subscribe((nodes: any) => {
            this.allNodes = nodes;
        });
    }

    private getRandomCoordinate() {
        return parseFloat((Math.random() * 90).toFixed(2));
    }
}