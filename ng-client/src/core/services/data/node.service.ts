
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { RpcService } from './node-rpc.service';

import * as CONST from '../../common/constants';
import { BaseBlockModel } from 'src/models/block.models';
import { ConsensusNodeModel } from '../../../models';
import { GetPeersModel, Peer } from 'src/models';

@Injectable({
    providedIn: 'root',
})
export class NodeService {
    public allNodes: any[] = [];
    public markers: any[] = [];

    public peers = new Map<string, Peer>();

    public nodeBlockInfo = new BehaviorSubject<number>(0);
    public rpcEnabledNodes = new BehaviorSubject<any>(null);
    public restEnabledNodes = new BehaviorSubject<any>(null);
    public updateNodes = new BehaviorSubject<any[]>([]);
    public updateNodesMempool = new BehaviorSubject<any[]>([]);
    public updateMarkers = new EventEmitter<any[]>();

    public updateAll = false;
    public getAllMemPool: boolean;

    private updatedServerPeersOn = new Date();
    private firstTimeGettingPeers = true;
    private bestBlock: number;

    constructor(
        private http: HttpClient,
        private nodeRpcService: RpcService) {

        this.http.get(`${CONST.BASE_URL}/api/node/get`)
            .subscribe(res => {
                this.updateAllNodes(res);
                this.updateNodesData();

                this.getServerCachedPeers()
                    .subscribe(x => {
                        const serverpeers = x;
                        serverpeers.forEach(p => this.checkOrAddToPeers(p, this.peers));

                        this.updateNodesData();
                    }, err => {
                        console.log(err);
                    });
            }, err => {
                console.log(`error getting nodes`, err);
            });
    }

    public stopUpdatingAll() {
        this.updateAll = false;
    }

    public startUpdatingAll() {
        this.updateAll = true;
    }

    public getBlockStamp(input: string | number) {
        let type = 'hash';
        if (typeof input === 'number') {
            type = 'height';
        }

        return this.http.get<BaseBlockModel>(`${CONST.BASE_URL}/api/block/stampby${type}/${input}`);
    }

    public getWsState(node: any) {
        if (!this.updateAll) return;

        this.http.get(`${CONST.BASE_URL}/api/node/wsstatus/${node.id}`)
            .subscribe(res => {
                const wsstatus = res as boolean;
                node.wsStatus = wsstatus;
            }, err => {
                node.wsStatus = false;
                console.log(err);
            });
    }

    public getNodes(): any[] {
        return this.allNodes;
    }

    public getNode(id: number): Observable<Object> {
        return this.http.get(`${CONST.BASE_URL}/api/node/get/${id}`);
    }

    public getServerCachedPeers(): Observable<Peer[]> {
        return this.http.get<Peer[]>(`${CONST.BASE_URL}/api/node/GetRPCNodes`);
    }

    public sendPeersToServerCache(): Observable<Object> {
        const now = new Date();
        if (!this.firstTimeGettingPeers && (now.getTime() - this.updatedServerPeersOn.getTime()) < CONST.HourInMs) {
            throw observableThrowError(`Not time for rpc peers send`);
        }

        return this.http.post(`${CONST.BASE_URL}/api/node/addrpcnodes`, Array.from(this.peers.values()));
    }

    protected getJsonHeaders(): any {
        return { headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }) };
    }

    public getConsensusNodes(): Observable<any> {
        return this.http.get<ConsensusNodeModel[]>(`${CONST.BASE_URL}/api/node/consensus`, this.getJsonHeaders());
    }

    public getNodesApi(page: number = 1, pageSize: number = 99999): any {
        return this.http.get(`${CONST.BASE_URL}/api/node/page?page=${page}&pageSize=${pageSize}`, this.getJsonHeaders());
    }

    getNodeDisplayText(node: any) {
        return node.successUrl ? node.successUrl : node.ip;
    }

    updateNodesData() {
        this.allNodes.forEach(x => {
            this.getBlockCount(x);
            this.getVersion(x);
            this.getPeers(x);
        });

        this.sort();
        this.updateNodes.next(this.allNodes);
        this.rpcEnabledNodes.next(this.allNodes.filter(x => x.rpcEnabled).length);
        this.restEnabledNodes.next(this.allNodes.filter(x => x.restEnabled).length);

        if (this.peers.size > 0) {
            this.sendPeersToServerCache().subscribe(
                x => {
                    this.updatedServerPeersOn = new Date();
                    this.firstTimeGettingPeers = false;
                }, err => console.log(err));
        }
    }

    updateAllNodesMempool() {
        this.allNodes.forEach(x => {
            if (x && x.rpcEnabled) {
                this.getRawMemPool(x, true);
            }
        });

        this.updateNodesMempool.next(this.allNodes);
    }

    updateAllNodes(nodes: any): void {
        const that = this;
        nodes.forEach(x => {
            if (that.allNodes.find(z => that.getNodeDisplayText(z) === that.getNodeDisplayText(x))) {
                return;
            }

            x.displayText = this.getNodeDisplayText(x);
            x.p2pEnabled = true;
            x.isWalletOpen = false;
            x.checks = 0;
            x.available = true;
            that.allNodes.push(x);
        });
    }

    public getNodeNameByIp(ip: string): any {
        const result = {
            isNode: false,
            address: ip,
            id: null
        };

        for (const node of this.allNodes) {
            if (node.ips.includes(ip)) {
                result.address = node.url;
                result.isNode = true;
                result.id = node.id;
                break;
            }
        }

        return result;
    }

    private handlePeers(received: GetPeersModel): void {
        received.bad.forEach((y: Peer) => {
            this.checkOrAddToPeers(y, this.peers);
        });
        received.connected.forEach((y: Peer) => {
            this.checkOrAddToPeers(y, this.peers);
        });
        received.unconnected.forEach((y: Peer) => {
            this.checkOrAddToPeers(y, this.peers);
        });
    }

    private checkOrAddToPeers(x: Peer, collection: Map<String, Peer>): void {
        const peerAddress = x.address.startsWith('::ffff:')
            ? x.address.substring(7)
            : x.address;

        if (collection.has(peerAddress)) {
            return;
        }

        collection.set(peerAddress, x);
    }

    public getBlockCount(node: any, getStamp: boolean = false) {
        // if (!this.updateAll) return;
        if (!node.available && node.checks < 10) {
            node.checks++;
            return;
        } else {
            node.checks = 0;
            node.available = true;
        }

        if (node.service) {
            if (node.service === 'neoScan') {
                const requestStart = Date.now();

                this.http.get(`${node.url}get_height`)
                    .subscribe((x: any) => {
                        const response = x;
                        const now = Date.now();

                        node.latency = Math.round((now - requestStart));
                        node.blockCount = response.height;
                        node.restEnabled = true;

                        this.updateBestBlockCount(node.blockCount);

                        if (getStamp && this.bestBlock > node.blockCount) {
                            this.getBlockStamp(+node.blockCount)
                                .subscribe(y => {
                                    const block = y;
                                    node.lastBlockStamp = block.timestamp;
                                }, err => console.log(err));
                        }

                        this.restEnabledNodes.next(this.allNodes.filter(z => z.restEnabled).length);

                    }, err => {
                        console.log(err);
                        node.available = false;
                        node.checks = 0;
                        node.restEnabled = false;
                        node.blockCount = null;
                        node.latency = null;
                        this.restEnabledNodes.next(this.allNodes.filter(x => x.restEnabled).length);
                    });
            } else if (node.service === 'neoNotification') {
                const requestStart = Date.now();

                this.http.get(`${node.url}version`)
                    .subscribe((x: any) => {
                        const response = x;
                        const now = Date.now();

                        node.latency = Math.round((now - requestStart));
                        node.version = response.version;
                        node.blockCount = response.current_height;
                        node.restEnabled = true;
                        this.updateBestBlockCount(+node.blockCount);
                        if (getStamp && this.bestBlock > node.blockCount) {
                            this.getBlockStamp(+node.blockCount)
                                .subscribe(y => {
                                    const block = y;
                                    node.lastBlockStamp = block.timestamp;
                                }, err => console.log(err));
                        }
                        this.restEnabledNodes.next(this.allNodes.filter(z => z.restEnabled).length);
                    }, err => {
                        console.log(err);
                        node.available = false;
                        node.checks = 0;
                        node.restEnabled = false;
                        node.blockCount = null;
                        node.latency = null;
                        this.restEnabledNodes.next(this.allNodes.filter(x => x.restEnabled).length);
                    });
            }
        } else {
            const requestStart = Date.now();

            this.nodeRpcService.callMethod(node.successUrl, 'getblockcount', 3)
                .subscribe(res => {
                    const now = Date.now();
                    node.lastResponseTime = now;
                    node.latency = Math.round((now - requestStart));
                    const response = res;
                    node.lastBlockCount = node.blockCount;
                    node.blockCount = response.result;
                    node.rpcEnabled = true;

                    this.updateBestBlockCount(+response.result);

                    if (getStamp && this.bestBlock > node.blockCount) {
                        this.getBlockStamp(+node.blockCount)
                            .subscribe(y => {
                                const block = y;
                                node.lastBlockStamp = block.timestamp;
                            }, err => console.log(err));
                    }

                    this.rpcEnabledNodes.next(this.allNodes.filter(x => x.rpcEnabled).length);
                }, err => {
                    node.available = false;
                    node.checks = 0;
                    node.rpcEnabled = false;
                    node.latency = null;

                    this.rpcEnabledNodes.next(this.allNodes.filter(x => x.rpcEnabled).length);
                });
        }
    }

    public getVersion(x: any) {
        if (!this.updateAll || !x.available || x.service) {
            return;
        }

        const requestStart = Date.now();
        this.nodeRpcService.callMethod(x.successUrl, 'getversion', 3)
            .subscribe(res => {
                const now = Date.now();
                x.lastResponseTime = now;
                if (x.type === 'RPC') x.latency = Math.round((now - requestStart));

                const response = res;
                x.version = response.result.useragent;
                x.rpcEnabled = true;
            }, err => {
                x.rpcEnabled = false;

                if (x.type === 'RPC') x.latency = 0;
            });
    }

    public getPeers(x: any, addCollections: boolean = false): void {
        if (!this.updateAll || !x.available || x.service) return;

        this.nodeRpcService.callMethod(x.successUrl, 'getpeers', 1)
            .subscribe(res => {
                const json = res;

                if (json.result) {
                    // tslint:disable-next-line:radix
                    x.peers = parseInt(json.result.connected.length);

                    const model = res.result as GetPeersModel;

                    this.handlePeers(model);

                    if (model.connected && model.connected.length > 0) {
                        x.connected = true;
                    }

                    x.connectedPeers = model.connected;
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
        if (!this.updateAll || !x.available || x.service) return;

        this.nodeRpcService.callMethod(x.successUrl, 'getconnectioncount', 1)
            .subscribe(res => {
                x.lastResponseTime = Date.now();

                const json = res;
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
            }, console.error);
    }

    public getRawMemPool(x: any, overwriteCheck = false) {
        if (!overwriteCheck) {
            if (!this.updateAll || !x.available || x.service) return;
        }

        this.nodeRpcService.callMethod(x.successUrl, 'getrawmempool', 1)
            .subscribe(res => {
                x.lastResponseTime = Date.now();
                const response = res;
                x.pendingTransactions = response.result;
            }, console.error);
    }

    public getWalletState(x: any) {
        if (!this.updateAll || !x.available || x.service) return;

        this.nodeRpcService.callMethod(x.successUrl, 'listaddress', 1)
            .subscribe(res => {
                x.isWalletOpen = true;
            }, err => {
                x.isWalletOpen = false;
            }, console.error);
    }

    private updateBestBlockCount(x: number) {
        if (!this.bestBlock || this.bestBlock < x) {
            this.bestBlock = x;
            this.nodeBlockInfo.next(this.bestBlock);
        }
    }

    private sort() {
        if (!this.updateAll) return;

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
