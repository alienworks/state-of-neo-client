import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { NodesSignalRService } from '../signal-r/nodes-signal-r.service';
import { RpcService } from './node-rpc.service';

import * as CONST from '../../common/constants';
import { Observable } from 'rxjs';
import { BaseBlockModel } from 'src/models/block.models';

@Injectable()
export class NodeService {
    public allNodes: any[] = [];
    public markers: any[] = [];
    public nodeBlockInfo = new EventEmitter<number>();
    public rpcEnabledNodes = new EventEmitter<number>();
    public updateNodes = new EventEmitter<any[]>();
    public updateMarkers = new EventEmitter<any[]>();

    private isStopped = false;

    constructor(private http: Http,
        private _nodeSignalRService: NodesSignalRService,
        private _nodeRpcService: RpcService) {

        this.http.get(`${CONST.BASE_URL}/api/node/get`)
            .subscribe(res => {
                this.updateAllNodes(res.json());
                this.sort();
                this.updateNodesData();
            }, err => {
                console.log(`error getting nodes`, err);
            });
    }

    public stopService() {
        this.isStopped = true;
    }

    public startService() {
        this.isStopped = false;
    }

    private subscribeToEvents() {
        this._nodeSignalRService.messageReceived.subscribe((nodes: any[]) => {
            this.updateAllNodes(nodes);
            this.sort();
            this.updateNodesData();
        });
    }

    public getBlockStamp(input: string | number) {
        let type = 'hash';
        if (typeof input === 'number') { type = 'height'; }
        return this.http.get(`${CONST.BASE_URL}/api/block/stampby${type}/${input}`);
    }

    public getNodes(): any[] {
        return this.allNodes;
    }

    public getNode(id: number): Observable<Response> {
        return this.http.get(`${CONST.BASE_URL}/api/node/get/${id}`);
    }

    protected getJsonHeaders(): RequestOptions {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return new RequestOptions({ headers: headers });
    }

    public getConsensusNodes(): Observable<Response> {
        return this.http.get(`${CONST.BASE_URL}/api/node/consensus`, this.getJsonHeaders());
    }

    public getNodesApi(page: number = 1, pageSize: number = 10): any {
        return this.http.get(`${CONST.BASE_URL}/api/node/page?page=${page}&pageSize=${pageSize}`, this.getJsonHeaders());
    }

    getNodeDisplayText(node: any) {
        return node.successUrl ? node.successUrl : node.ip;
    }

    updateNodesData() {
        if (this.isStopped) return;

        this.allNodes.forEach(x => {
            if (this.isStopped) return;
            this.getConnectionsCount(x);
            this.getVersion(x);
            this.getBlockCount(x);
            // this.getPeers(x);
            this.sort();
            console.log(x.url, x);
        });
        this.updateAllMarkers();

        this.updateNodes.emit(this.allNodes);
        this.updateMarkers.emit(this.markers);
        this.rpcEnabledNodes.emit(this.allNodes.filter(x => x.rpcEnabled).length);
    }

    updateAllNodes(nodes: any): void {
        if (this.isStopped) return;

        const that = this;
        nodes.forEach(x => {
            if (this.isStopped) return;
            if (that.allNodes.find(z => that.getNodeDisplayText(z) === that.getNodeDisplayText(x))) {
                return;
            }

            x.displayText = this.getNodeDisplayText(x);
            x.p2pEnabled = true;
            x.isWalletOpen = false;
            that.allNodes.push(x);
        });
    }

    updateAllMarkers(): void {
        if (this.isStopped) return;

        const markers = [];
        this.allNodes.forEach(x => {
            markers.push({
                id: x.id,
                latLng: [x.latitude, x.longitude],
                name: this.getNodeDisplayText(x),
                version: x.version,
                blockCount: x.blockCount
            });
        });
        this.markers = markers;
    }

    public getPeers(x: any) {
        if (this.isStopped) return;

        this._nodeRpcService.callMethod(x.successUrl, 'getpeers', 1)
            .subscribe(res => {
                const json = res.json();

                if (json.result) {
                    // tslint:disable-next-line:radix
                    x.peers = parseInt(json.result.connected.length);
                } else {
                    x.peers = 0;
                }

                if (x.peers > 0) {
                    x.p2pEnabled = true;
                } else {
                    x.p2pEnabled = false;
                }
            }, err => {
                x.p2pEnabled = false;
            });
    }

    public getConnectionsCount(x: any) {
        if (this.isStopped) return;

        this._nodeRpcService.callMethod(x.successUrl, 'getconnectioncount', 1)
            .subscribe(res => {
                x.lastResponseTime = Date.now();

                const json = res.json();
                if (json.result) {
                    // tslint:disable-next-line:radix
                    x.connected = parseInt(json.result);
                    x.p2pEnabled = true;

                    this.sort();
                } else {
                    console.log(res);
                    x.connected = null;
                    x.p2pEnabled = false;
                }
            });
    }

    public getVersion(x: any) {
        if (this.isStopped) return;

        const requestStart = Date.now();
        this._nodeRpcService.callMethod(x.successUrl, 'getversion', 3)
            .subscribe(res => {
                const now = Date.now();
                x.lastResponseTime = now;
                x.latency = Math.round((now - requestStart));

                const response = res.json();
                x.version = response.result.useragent;
                x.rpcEnabled = true;
            }, err => {
                x.rpcEnabled = false;
                x.latency = 0;
            });
    }

    public getBlockCount(node: any, getStamp: boolean = false) {
        if (this.isStopped) return;

        if (node.service) {
            if (node.service === 'neoScan') {
                const requestStart = Date.now();

                this.http.get(`${node.url}get_height`)
                    .subscribe((x: any) => {
                        const response = x.json();
                        const now = Date.now();

                        node.latency = Math.round((now - requestStart));
                        node.blockCount = response.height;
                    }, err => console.log(err));
            } else if (node.service === 'neoNotification') {
                const requestStart = Date.now();

                this.http.get(`${node.url}version`)
                    .subscribe((x: any) => {
                        const response = x.json();
                        const now = Date.now();

                        node.latency = Math.round((now - requestStart));
                        node.version = response.version;
                        node.blockCount = response.current_height;
                    }, err => {
                        console.log(err);
                    });
            }
        } else {
            this._nodeRpcService.callMethod(node.successUrl, 'getblockcount', 3)
                .subscribe(res => {
                    const now = Date.now();
                    node.lastResponseTime = now;
                    const response = res.json();
                    node.lastBlockCount = node.blockCount;
                    node.blockCount = response.result;

                    if (getStamp && node.lastBlockCount !== node.blockCount) {
                        this.getBlockStamp(+node.blockCount)
                            .subscribe(y => {
                                const block = y.json() as BaseBlockModel;
                                node.lastBlockStamp = block.timestamp;
                            }, err => console.log(err));
                    }

                    this.nodeBlockInfo.emit(response.result);
                }, err => {
                    node.rpcEnabled = false;
                    node.latency = 0;
                });
        }
    }

    public getRawMemPool(x: any) {
        if (this.isStopped) return;

        this._nodeRpcService.callMethod(x.successUrl, 'getrawmempool', 1)
            .subscribe(res => {
                x.lastResponseTime = Date.now();
                const response = res.json();
                x.pendingTransactions = response.result;
            });
    }

    public getWalletState(x: any) {
        if (this.isStopped) return;

        this._nodeRpcService.callMethod(x.successUrl, 'listaddress', 1)
            .subscribe(res => {
                x.isWalletOpen = true;
            }, err => {
                x.isWalletOpen = false;
            });
    }

    private sort() {
        if (this.isStopped) return;

        this.allNodes = this.allNodes.sort((x, y) => {
            if (!x.blockCount && y.blockCount) {
                return 1;
            } else if (x.blockCount && !y.blockCount) {
                return -1;
            } else if (x.blockCount !== y.blockCount) {
                return y.blockCount - x.blockCount;
            }

            return x.latency - y.latency;
        });
    }
}
