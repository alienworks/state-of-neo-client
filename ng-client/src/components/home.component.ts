import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from '../core/services/data/node.service';
import { CommonStateService } from '../core/services';

declare var $;

@Component({
    selector: `app-home`,
    templateUrl: `./home.component.html`,
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    allNodes: any[] = [];
    interval: number;

    constructor(private _nodeService: NodeService,
        private state: CommonStateService
    ) {
        this.subscribeToEvents();
    }

    get savedRpc() {
        return this.allNodes.filter(x => x.type === 'RPC');
    }

    get rpcEnabled() {
        return this.allNodes.filter(x => x.type === 'RPC' && x.rpcEnabled);
    }

    ngOnInit() {
        this.state.changeRoute('home');
        this.allNodes = this._nodeService.getNodes();

        this.interval =
            window.setInterval(() => {
                this._nodeService.updateNodesData();
                this.allNodes = this._nodeService.getNodes();
            }, 5000);

        // window height - header - body padding top and bottom
        const height = $(window).height() - 50 - 70 - 20 - 20;
        $('#nodes-panel').css('height', height + 'px');
        $('#main-panel').css('height', height + 'px');
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private subscribeToEvents(): void {
        this._nodeService.updateNodes.subscribe((nodes: any) => {
            this.allNodes = nodes;
        });
    }
}
