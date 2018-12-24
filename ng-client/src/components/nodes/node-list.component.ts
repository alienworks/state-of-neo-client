import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from '../../core/services/data/node.service';
import { CommonStateService } from '../../core/services';
import { PageResultModel, BaseNodeModel } from '../../models';
import { BlockService } from '../../core/services/data';

@Component({
    selector: `app-node-list`,
    templateUrl: './node-list.component.html',
    styleUrls: ['./node-list.component.css']
})
export class NodeListComponent implements OnInit, OnDestroy {
    pageResults: PageResultModel<BaseNodeModel>;
    bestBlock: number;
    isLoading = true;
    interval: number;
    page = 1;
    nodes: any[] = [];

    constructor(
        private nodeService: NodeService,
        private state: CommonStateService,
        private blockService: BlockService) { }

    ngOnInit(): void {
        this.state.changeRoute('nodes');
        this.nodeService.startService();
        this.nodes = this.nodeService.getNodes();

        this.bestBlock = this.blockService.bestBlock;

        this.interval =
            window.setInterval(() => {
                this.nodeService.updateNodesData();
                this.nodes = this.nodeService.getNodes();
            }, 5000);

        this.nodeService.updateNodes.subscribe((nodes: any) => {
            this.nodes = nodes;
        });

        this.bestBlock = this.blockService.bestBlock;

        this.blockService.bestBlockChanged.subscribe((block: number) => this.bestBlock = block);

        this.getPage(1);
    }

    ngOnDestroy(): void {
        if (this.interval) {
            this.nodeService.stopService();
            clearInterval(this.interval);
        }
    }

    getPage(page: number): void {
        this.isLoading = true;
        this.nodeService.getNodesApi(page)
            .subscribe(pageResults => {
                this.pageResults = pageResults.json() as PageResultModel<BaseNodeModel>;
                this.isLoading = false;
                this.updateNodesList();

                this.interval = window.setInterval(() => {
                    this.updateNodesList();
                }, 5000);
            });
    }

    updateNodesList() {
        this.pageResults.items.forEach(x => {
            this.nodeService.getBlockCount(x);
            this.nodeService.getVersion(x);
            this.nodeService.getConnectionsCount(x);
        });
    }

    getClassForNodeLatency(node: any) {
        if (node.latency && node.latency < 500) {
            return 'text-success';
        } else if (node.latency >= 500 && node.latency < 2500) {
            return 'text-warning';
        } else {
            return 'text-danger';
        }
    }
}
