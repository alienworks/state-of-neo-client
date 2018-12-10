import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from '../../core/services/data/node.service';
import { PageResultModel, BaseNodeModel } from '../../models';
import { BlockService } from '../../core/services/data';

@Component({
    selector: `app-node-list`,
    templateUrl: './node-list.component.html'
})
export class NodeListComponent implements OnInit, OnDestroy {
    pageResults: PageResultModel<BaseNodeModel>;
    bestBlock: number;
    isLoading = true;
    interval: number;

    constructor(private _nodeService: NodeService, private _blockService: BlockService) { }

    ngOnInit(): void {
        this.bestBlock = this._blockService.bestBlock;

        this._blockService.bestBlockChanged.subscribe((block: number) => this.bestBlock = block);

        this.getPage(1);
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    getPage(page: number): void {
        this.isLoading = true;
        this._nodeService.getNodesApi(page)
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
            this._nodeService.getBlockCount(x);
            this._nodeService.getVersion(x);
            this._nodeService.getConnectionsCount(x);
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
