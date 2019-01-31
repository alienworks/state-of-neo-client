import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeService } from '../../core/services/data/node.service';
import { BlockService } from '../../core/services/data/block.service';
import { CommonStateService } from '../../core/services';

import { Network } from 'vis';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: `./node-details.component.html`
})
export class NodeDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
    id: number;
    node: any;
    bestBlock: number;
    p = 1;
    interval: number;

    // VIS
    network: Network;
    oldPeers = new Set<string>();
    nodeIdsByIndex = new Map();

    constructor(
        private route: ActivatedRoute,
        private nodeService: NodeService,
        private state: CommonStateService,
        private blockService: BlockService,
        private router: Router) {
        super();
    }

    ngOnDestroy(): void {
        this.nodeService.stopUpdatingAll();
        this.clearSubscriptions();
        window.clearInterval(this.interval);
    }

    ngOnInit(): void {
        this.state.changeRoute('node');
        this.nodeService.startUpdatingAll();

        this.addSubsctiption(
            this.blockService.bestBlockChanged.subscribe((x: number) => {
                this.bestBlock = x;
            })
        );

        this.interval = window.setInterval(() => {
            this.updateNodeInfo();
            this.drawGraph();
        }, 5000);

        this.addSubsctiption(
            this.route.params.subscribe(x => {
                this.id = x['id'];
                this.node = null;
                this.network = null;

                this.nodeService.getNode(this.id)
                    .subscribe((node: any) => {
                        this.node = node;
                        this.updateNodeInfo();
                        this.drawGraph();

                        if (this.node.firstRuntime) {
                            this.node.trackedSeconds = this.getSecondsSinceTrackingStarted();
                        }
                    });
            })
        );
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
            this.nodeService.getRawMemPool(this.node);
            this.nodeService.getBlockCount(this.node, true);
            this.nodeService.getVersion(this.node);
            this.nodeService.getPeers(this.node, true);
            this.nodeService.getWalletState(this.node);
            this.nodeService.getWsState(this.node);
        }
    }

    getSecondsSinceTrackingStarted(): number {
        if (this.node.secondsOnline && this.node.firstRuntime && this.node.latestRuntime) {
            const totalSeconds = this.node.latestRuntime - this.node.firstRuntime;
            return totalSeconds;
        }

        return 0;
    }

    drawGraph() {
        if (!this.node.connectedPeers || this.node.connectedPeers.length === 0) {
            return;
        }

        if (this.oldPeers.size > 0) {
            let foundDiscrepancy = false;

            for (const peer of this.node.connectedPeers) {
                const address = peer.address.startsWith('::ffff:')
                    ? peer.address.substring(7)
                    : peer.address;

                if (!this.oldPeers.has(address)) {
                    foundDiscrepancy = true;
                    break;
                }
            }

            if (!foundDiscrepancy) {
                return;
            }
        }

        // create people.
        // value corresponds with the age of the person
        this.oldPeers = new Set<string>();

        const nodes = [{ id: 1, value: 1, label: this.node.url, data: this.id }];

        this.nodeIdsByIndex = new Map();
        this.nodeIdsByIndex.set(1, this.id);

        for (let i = 0; i < this.node.connectedPeers.length; i++) {
            const peer = this.node.connectedPeers[i];
            const address = peer.address.startsWith('::ffff:')
                ? peer.address.substring(7)
                : peer.address;

            const nodeLookupResult = this.nodeService.getNodeNameByIp(address);
            const peerName = nodeLookupResult.address;
            if (nodeLookupResult.isNode) {
                this.nodeIdsByIndex.set(i + 2, nodeLookupResult.id);
            }

            nodes.push({ id: i + 2, value: 1, label: peerName, data: null });
            this.oldPeers.add(address);
        }

        // create connections between people
        // value corresponds with the amount of contact between two people
        const edges = [];
        for (const peer of nodes) {
            if (peer.id === 1) {
                continue;
            }

            edges.push({ from: peer.id, to: 1 });
        }

        const data = {
            nodes: nodes,
            edges: edges
        };

        if (!this.network) {
            const container = document.getElementById('mynetwork');
            const options = {
                nodes: {
                    shape: 'dot',
                }
            };

            this.network = new Network(container, data, options);

            this.network.on('click', (e: any) => {
                if (e.nodes.length !== 1) {
                    return;
                }

                const index = e.nodes[0];
                if (this.nodeIdsByIndex.has(index)) {
                    const nodeId = this.nodeIdsByIndex.get(index);
                    const route = `node/${nodeId}`;

                    this.router.navigate([route]);
                }
            });
        } else {
            this.network.setData(data);
        }
    }
}
