import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from '../core/services/data/node.service';
import { CommonStateService } from '../core/services';
import { BaseComponent } from './base/base.component';

declare var $;

@Component({
    selector: `app-home`,
    templateUrl: `./home.component.html`,
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
    nodeNameFilter = '';
    allNodes: any[] = [];
    filteredNodes: any = [];

    constructor(
        private nodeService: NodeService,
        private state: CommonStateService) {
        super();
    }

    get savedRpc() {
        return this.allNodes.filter(x => x.type === 'RPC');
    }

    get rpcEnabled() {
        return this.allNodes.filter(x => x.type === 'RPC' && x.rpcEnabled);
    }

    ngOnInit() {
        this.state.changeRoute('home');
        this.nodeService.startUpdatingAll();

        this.allNodes = this.nodeService.getNodes();
        this.addSubscription(
            this.nodeService.updateNodes.subscribe((x: any[]) => {
                this.allNodes = x;
                this.filter();
            })
        );

        // window height - header - body padding top and bottom
        let height = $(window).height() - 50 - 60;
        if ($(window).width() <= 1265) {
            height -= 50;
        }

        $('#nodes-panel').css('height', height + 'px');
        $('#main-panel').css('height', height + 'px');
    }

    ngOnDestroy(): void {
        this.nodeService.stopUpdatingAll();
        this.clearSubscriptions();
    }

    filter(): void {
        this.filteredNodes = this.allNodes;

        if (this.nodeNameFilter.length) {
            this.filteredNodes = this.filteredNodes.filter(x => x.url.includes(this.nodeNameFilter));
        }
    }
}
