import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeService } from '../../core/services/data/node.service';
import { BlockService } from '../../core/services/data/block.service';
import { CommonStateService } from '../../core/services';

@Component({
    templateUrl: `./node-details.component.html`
})
export class NodeDetailsComponent implements OnInit, OnDestroy {
    id: number;
    node: any;
    bestBlock: number;
    p = 1;
    interval: number;

    constructor(private route: ActivatedRoute,
        private _nodeService: NodeService,
        private state: CommonStateService,
        private _blockService: BlockService) {

        this._blockService.bestBlockChanged.subscribe((x: number) => {
            this.bestBlock = x;
        });

        this.interval = window.setInterval(() => {
            this.updateNodeInfo();
        }, 5000);
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    ngOnInit(): void {
        this._nodeService.startService();
        this.state.changeRoute('nodes');

        this.id = +this.route.snapshot.paramMap.get('id');

        this._nodeService.getNode(this.id)
            .subscribe((node: any) => {
                this.node = node.json();
                this.updateNodeInfo();

                if (this.node.firstRuntime) {
                    this.node.trackedSeconds = this.getSecondsSinceTrackingStarted();
                }
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
            this._nodeService.getBlockCount(this.node, true);
            this._nodeService.getVersion(this.node);
            this._nodeService.getConnectionsCount(this.node);
            this._nodeService.getWalletState(this.node);
        }
    }

    getSecondsSinceTrackingStarted(): number {
        if (this.node.secondsOnline && this.node.firstRuntime) {
            const currentDate = Date.now().valueOf();
            const totalSeconds = Math.floor(currentDate / 1000) - this.node.firstRuntime;
            return totalSeconds;
        }

        return 0;
    }
}
