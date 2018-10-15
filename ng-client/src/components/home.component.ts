import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { DYNAMIC_TYPE } from '@angular/compiler/src/output/output_ast';

import { SignalRService } from 'src/core/services/signal-r.service';
import { NodesSignalRService } from 'src/core/services/nodes-signal-r.service';
import { BlocksSignalRService } from 'src/core/services/blocks-signal-r.service';
import { NodeRpcService } from 'src/core/services/node-rpc.service';
import { TransCountSignalRService } from 'src/core/services/trans-count-signal-r.service';
import { TransAvgCountSignalRService } from 'src/core/services/trans-avg-count-signal-r.service';
import { FailP2PSignalRService } from 'src/core/services/fail-p2p-signal-r.service';

import { NodeService } from 'src/core/services/node.service';

import * as CONST from '../core/common/constants';

declare var $;
declare var jvm;

@Component({
    selector: `app-home`,
    templateUrl: `./home.component.html`
})
export class HomeComponent {
    bestBlock: number = 0;
    txCount: number;
    allNodes: any[] = [];
    allMessages: any[];
    canSendMessage: boolean;
    secondsSinceLastBlock: number = 0;
    savedNodes: any[] = [];
    blocksCounted: number = 0;
    blocksCountStart: number = Date.now();

    constructor(
        private _nodeService: NodeService,
        private _blockService: BlocksSignalRService,
        private _nodeSignalRService: NodesSignalRService,
        private _transCountService: TransCountSignalRService,
        private _failP2PService: FailP2PSignalRService,
        private _http: Http,
        private nodeRpcService: NodeRpcService
    ) {
        this._blockService.init(`${CONST.BASE_URL}/hubs/block`);
        this._nodeSignalRService.init(`${CONST.BASE_URL}/hubs/node`);
        this._transCountService.init(`${CONST.BASE_URL}/hubs/trans-count`);
        this._failP2PService.init(`${CONST.BASE_URL}/hubs/fail-p2p`);
        this.subscribeToEvents();
        this.allMessages = [];

        setInterval(() => {
            this._nodeService.updateNodesData();
            this.allNodes = this._nodeService.getNodes();
        }, 5000);
    }

    get savedRpc() {
        return this.allNodes.filter(x => x.type == 'RPC');
    }

    get rpcEnabled() {
        return this.allNodes.filter(x => x.type == 'RPC' && x.rpcEnabled);
    }

    ngOnInit() {
        this.allNodes = this._nodeService.getNodes();
        // this._http.get(`${CONST.BASE_URL}/api/block/getheight`)
        //   .subscribe(x => this.updateBestBlock(parseInt(x.json())));

        // window height - header - body padding top and bottom
        let height = $(window).height() - 50 - 20 - 20;
        $('#nodes-panel').css('height', height + 'px');
        $('#main-panel').css('height', height + 'px');
    }

    updateBlocks() {
        if (this.canSendMessage) {
            this._http.post(`${CONST.BASE_URL}/api/block`, null, this.getJsonHeaders())
                .subscribe();
        }
    }

    protected getJsonHeaders(): RequestOptions {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return new RequestOptions({ headers: headers });
    }

    private subscribeToEvents(): void {
        this._transCountService.messageReceived.subscribe((count: number) => {
            this.txCount = count;
        });

        this._blockService.connectionEstablished.subscribe(() => {
            this.canSendMessage = true;
        });

        // this._blockService.messageReceived.subscribe((message: number) => {
        //   this.updateBestBlock(message);
        // });

        // this._failP2PService.messageReceived.subscribe((message: string[]) => {
        //   this.allNodes.filter(x => message.some(z => x.successUrl)).forEach(x => {
        //     x.p2pEnabled = false;
        //   });
        // });

        this._nodeSignalRService.connectionEstablished.subscribe(() => { });

        this._nodeService.UpdateNodes.subscribe((nodes: any) => {
            this.allNodes = nodes;
        });
        this._nodeService.UpdateMarkers.subscribe((markers: any) => {
            this.initMap(markers);
        });
    }

    private initMap(markers) {
        $('#world-map').html('');
        $('#world-map').css('height', '412px');
        $('#world-map').vectorMap({
            map: 'world_mill_en',
            backgroundColor: 'transparent',
            markers: markers,

            hoverOpacity: 0.7,
            hoverColor: false,
            markersSelectable: true,
            onMarkerSelected: (e: any, code: string, isSelected: boolean, selectedMarkers: any[]) => {
                $('div.jvectormap-container').trigger('markerLabelShow', [map.label, code]);
            },
            onMarkerClick: (e: any, code: string) => {

            },
            onRegionLabelShow: (e: any) => {
                e.preventDefault();
            },
            onMarkerLabelShow: (e: any, label: any, code: string) => {
                // label.html('<h1>TEST TEST TEST</h1>');

            },
            onMarkerTipShow: (e: any, tip: any, code: string) => {

            }
        });

        let map = $('#world-map').vectorMap('get', 'mapObject');

        $(window).resize(function () {
            $('#world-map').css('height', '412px');
        });
    }

    hoverOffNode(node: any) {
        let map = $('#world-map').vectorMap('get', 'mapObject');
        map.clearSelectedMarkers();
        map.label.css('display', 'none');
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

    getClassForNodeUptime(node: any) {
        if (node.upTime && node.upTime >= 98) {
            return 'text-success';
        } else if (node.upTime < 98 && node.upTime >= 93) {
            return 'text-warning';
        } else {
            return 'text-danger';
        }
    }

    private getAverageBlockTime() {
        let now = Date.now();
        let elapsed = (now - this.blocksCountStart) / 1000;

        return Math.round(elapsed / this.blocksCounted);
    }

    private getRandomCoordinate() {
        return parseFloat((Math.random() * 90).toFixed(2));
    }
}