import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeService } from '../../core/services/data/node.service';
import { BlockService } from '../../core/services/data/block.service';
import { CommonStateService } from '../../core/services';

import * as vis from 'vis';

@Component({
    templateUrl: `./node-details.component.html`
})
export class NodeDetailsComponent implements OnInit, OnDestroy {
    id: number;
    node: any;
    bestBlock: number;
    p = 1;
    interval: number;

    // VIS
    nodes: any;
    edges: any;
    network: any;

    constructor(private route: ActivatedRoute,
        private _nodeService: NodeService,
        private state: CommonStateService,
        private _blockService: BlockService) {

        this._blockService.bestBlockChanged.subscribe((x: number) => {
            this.bestBlock = x;
        });

        this.interval = window.setInterval(() => {
            this.updateNodeInfo();
            this.drawGraph();
        }, 5000);
    }

    ngOnDestroy(): void {
        this._nodeService.stopUpdatingAll();
    }

    ngOnInit(): void {
        this.state.changeRoute('node');

        this._nodeService.startUpdatingAll();

        this.id = +this.route.snapshot.paramMap.get('id');

        this._nodeService.getNode(this.id)
            .subscribe((node: any) => {
                this.node = node;
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
            this._nodeService.getPeers(this.node, true);
            this._nodeService.getWalletState(this.node);
            this._nodeService.getWsState(this.node);
        }
    }

    getSecondsSinceTrackingStarted(): number {
        if (this.node.secondsOnline && this.node.firstRuntime && this.node.latestRuntime) {
            const currentDate = new Date(this.node.latestRuntime * 1000);
            const totalSeconds = this.node.latestRuntime - this.node.firstRuntime;
            return totalSeconds;
        }

        return 0;
    }

    drawGraph() {
        if (!this.node.connectedPeers && this.node.connectedPeers.length === 0) return;

        // create people.
        // value corresponds with the age of the person
        this.nodes = [{ id: 1, value: 1, label: this.node.url }];
        for (let i = 0; i < this.node.connectedPeers.length; i++) {
            const peer = this.node.connectedPeers[i];
            const address = peer.address.startsWith('::ffff:') ? peer.address.substring(7) : peer.address;
            const peerName = this._nodeService.getNodeNameByIp(address);
            this.nodes.push({ id: i + 2, value: 1, label: peerName });
        }

        // create connections between people
        // value corresponds with the amount of contact between two people
        this.edges = [];
        for (const peer of this.nodes) {
            if (peer.id === 1) continue;

            this.edges.push({ from: peer.id, to: 1 });
        }

        // Instantiate our network object.
        const container = document.getElementById('mynetwork');
        const data = {
            nodes: this.nodes,
            edges: this.edges
        };
        const options = {
            nodes: {
                shape: 'dot',
            }
        };
        this.network = new vis.Network(container, data, options);
    }
}
