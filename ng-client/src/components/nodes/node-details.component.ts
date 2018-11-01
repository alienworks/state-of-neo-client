import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeService } from '../../core/services/data/node.service';
import { BlockService } from '../../core/services/data/block.service';

@Component({
    templateUrl: `./node-details.component.html`
})
export class NodeDetailsComponent implements OnInit {
    id: number;
    node: any;
    bestBlock: number;

    constructor(private route: ActivatedRoute,
        private _nodeService: NodeService,
        private _blockService: BlockService) {

        this._blockService.bestBlockChanged.subscribe((x: number) => {
            this.bestBlock = x;
        });

        setInterval(() => {
            this.updateNodeInfo();
        }, 5000);
    }

    ngOnInit(): void {
        this.id = +this.route.snapshot.paramMap.get('id');

        this._nodeService.getNode(this.id)
            .subscribe((node: any) => {
                this.node = node.json();
                this.updateNodeInfo();
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

    updateNodeInfo() {
        if (this.node != null) {
            this._nodeService.getRawMemPool(this.node);
            this._nodeService.getBlockCount(this.node);
            this._nodeService.getVersion(this.node);
            this._nodeService.getConnectionsCount(this.node);
        }
    }
}
