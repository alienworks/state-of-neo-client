import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

import { NodesSignalRService } from 'src/core/services/nodes-signal-r.service';
import { NodeRpcService } from 'src/core/services/node-rpc.service';

import * as CONST from '../common/constants';

@Injectable({
    providedIn: 'root'
})
export class NodeService implements OnInit {
    public allNodes: any[] = [];
    public markers: any[] = [];
    public NodeBlockInfo = new EventEmitter<number>();
    public UpdateNodes = new EventEmitter<any[]>();
    public UpdateMarkers = new EventEmitter<any[]>();

    constructor(private http: Http,
        private _nodeSignalRService: NodesSignalRService,
        private _nodeRpcService: NodeRpcService) {
            
        this.http.get(`${CONST.BASE_URL}/api/node`)
            .subscribe(res => {
                let nodes = res.json()
                console.log(nodes);
                let that = this;
                nodes.forEach(x => {
                    if (that.allNodes.find(z => that.getNodeDisplayText(z) == that.getNodeDisplayText(x))) {
                        return;
                    }

                    x.p2pEnabled = true;
                    that.allNodes.push(x);
                })

                this.allNodes.forEach(x => {
                    this.markers.push({
                        latLng: [x.latitude, x.longitude], name: that.getNodeDisplayText(x)
                    });
                });

                this.sort();
                this.updateNodesData();
            }, err => {
                console.log(`error getting nodes`, err);
            });
         }

    ngOnInit(): void {
    }

    private subscribeToEvents() {
        this._nodeSignalRService.messageReceived.subscribe((nodes: any[]) => {
            console.log(nodes);
            let that = this;
            nodes.forEach(x => {
                if (that.allNodes.find(z => that.getNodeDisplayText(z) == that.getNodeDisplayText(x))) {
                    return;
                }

                x.p2pEnabled = true;
                that.allNodes.push(x);
            })

            let markers = [];
            this.allNodes.forEach(x => {
                markers.push({
                    latLng: [x.latitude, x.longitude], name: that.getNodeDisplayText(x)
                });
            });
            this.markers = markers;

            this.sort();
            this.updateNodesData();
        });
    }

    public getNodes(): any[] {
        return this.allNodes;
    }

    getNodeDisplayText(node: any) {
        return node.successUrl ? node.successUrl : node.ip;
    }

    updateNodesData() {
        this.getVersion(this.allNodes);
        this.getConnectionsCount(this.allNodes);
        this.getRawMemPool(this.allNodes);
        this.getBlockCount(this.allNodes);
        this.checkP2PStatus();

        this.UpdateNodes.emit(this.allNodes);
        this.UpdateMarkers.emit(this.markers);
    }

    private getPeers(nodes: any[]) {
        nodes.forEach(x => {
            let url = `${x.protocol}://${x.url ? x.url : x.ip}:${x.port}`;
            let requestStart = Date.now();
            this._nodeRpcService.callRpcMethod(x.successUrl, 'getpeers', 1)
                .subscribe(res => {
                    x.lastResponseTime = Date.now();
                    // x.latency = x.lastResponseTime - requestStart;
                    let json = res.json();
                    if (json.result) {
                        x.peers = parseInt(json.result.connected.length);
                        this.sort();
                    } else {
                        console.log(res);
                    }
                });
        });
    }

    private checkP2PStatus(): void {
        this.allNodes.filter(x => x.ip).forEach(x => {
            this.http.post(`${CONST.BASE_URL}/api/p2pstatus/checkip/${x.ip}`, null)
                .subscribe(res => {
                    x.p2pEnabled = res.json();
                    console.log(x.p2pEnabled);
                }, err => {
                    console.log(err);
                })
        });
    }

    private getConnectionsCount(nodes: any[]) {
        nodes.forEach(x => {
            this._nodeRpcService.callRpcMethod(x.successUrl, 'getconnectioncount', 1)
                .subscribe(res => {
                    x.lastResponseTime = Date.now();
                    //   x.latency = x.lastResponseTime - requestStart;
                    let json = res.json();
                    if (json.result) {
                        x.connected = parseInt(json.result);
                        this.sort();
                    } else {
                        console.log(res);
                    }
                });
        });
    }

    private getVersion(nodes: any[]) {
        nodes.forEach(x => {
            let url = `${x.protocol}://${x.url ? x.url : x.ip}:${x.port}`;
            let requestStart = Date.now();
            this._nodeRpcService.callRpcMethod(x.successUrl, 'getversion', 3)
                .subscribe(res => {
                    let now = Date.now();
                    x.lastResponseTime = now;
                    x.latency = Math.round((now - requestStart));
                    let response = res.json();
                    x.version = response.result.useragent;
                    x.rpcEnabled = true;
                    this.sort();
                }, err => {
                    x.rpcEnabled = false;
                    x.latency = 0;
                });
        });
    }

    private getBlockCount(nodes: any[]) {
        nodes.forEach(x => {
            let url = `${x.protocol}://${x.url ? x.url : x.ip}:${x.port}`;
            let requestStart = Date.now();
            this._nodeRpcService.callRpcMethod(x.successUrl, 'getblockcount', 3)
                .subscribe(res => {
                    let now = Date.now();
                    x.lastResponseTime = now;
                    let response = res.json();
                    x.blockCount = response.result;

                    this.NodeBlockInfo.emit(response.result);
                    this.sort();
                }, err => {
                    x.rpcEnabled = false;
                    x.latency = 0;
                });
        })
    }

    private getRawMemPool(nodes: any[]) {
        nodes.forEach(x => {
            let url = `${x.protocol}://${x.url ? x.url : x.ip}:${x.port}`;
            let requestStart = Date.now();
            this._nodeRpcService.callRpcMethod(x.successUrl, 'getrawmempool', 1)
                .subscribe(res => {
                    x.lastResponseTime = Date.now();
                    //    x.latency = x.lastResponseTime - requestStart;
                    let response = res.json();
                    x.pendingTransactions = response.result.length;
                    this.sort();
                });
        });
    }

    private sort() {
        this.allNodes = this.allNodes.sort((x, y) => {
            if (!x.rpcEnabled && y.rpcEnabled) {
                return 1;
            } else if (x.rpcEnabled && !y.rpcEnabled) {
                return -1;
            }

            if (x.type != 'RPC' && y.type == 'RPC') {
                return 1;
            } else if (x.type == 'RPC' && y.type != 'RPC') {
                return -1;
            }

            if (!x.blockCount && y.blockCount) {
                return 1;
            } else if (x.blockCount && !y.blockCount) {
                return -1;
            } else if (x.blockCount != y.blockCount) {
                return y.blockCount - x.blockCount;
            }

            if (!x.connected && y.connected) {
                return 1;
            } else if (!y.connected && x.connected) {
                return -1;
            } else if (x.connected != y.connected) {
                return y.connected - x.connected;
            }

            return x.latency - y.latency;
        });
    }
}