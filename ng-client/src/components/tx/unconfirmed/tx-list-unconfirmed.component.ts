import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NodeService, BlockService } from 'src/core/services/data';
import { BaseComponent } from 'src/components/base/base.component';
import { CommonStateService } from 'src/core/services';

@Component({
    selector: 'app-tx-list-unconfirmed',
    templateUrl: `./tx-list-unconfirmed.component.html`
})
export class TxListUnconfirmedComponent extends BaseComponent implements OnInit, OnDestroy {
    isLoading: boolean;
    allNodes: any[];
    unconfirmedTxs = [];
    unconfirmedTxsFiltered = [];
    latestBlock: number;
    _filterHash: string;
    page = 1;

    @Input()
    set filterHash(val: string) {
        this._filterHash = val;
        this.filter();
    }

    @Output() totalNumberUpdate: EventEmitter<number> = new EventEmitter();

    constructor(
        private nodeService: NodeService,
        private state: CommonStateService,
        private blockService: BlockService) {
        super();
        this.isLoading = true;
    }

    ngOnDestroy(): void {
        this.nodeService.getAllMemPool = false;
        this.clearSubscriptions();
    }

    ngOnInit(): void {
        this.addSubsctiption(
            this.blockService.bestBlockChanged.subscribe(x => {
                this.latestBlock = x;
            })
        );

        this.addSubsctiption(
            this.nodeService.updateNodesMempool.subscribe(x => {
                // Add new txs and remove confirmed ones
                // Think of the best approach
                if (x && x.length > 0) {
                    this.allNodes = x;
                    this.unconfirmedTxs = this.generateArray(x
                        .filter(n => n.pendingTransactions)
                        .reduce((acc, val) => {
                            if (this.latestBlock - 20 < val.blockCount) {
                                val.pendingTransactions.forEach(ptx => {
                                    if (!acc[ptx]) {
                                        acc[ptx] = {
                                            txHash: ptx,
                                            nodes: [val]
                                        };
                                    } else {
                                        acc[ptx].nodes.push(val);
                                    }
                                });
                            }
                            return acc;
                        }, {})
                    );

                    this.filter();
                }
            })
        );

        this.nodeService.getAllMemPool = true;
        this.nodeService.updateAllNodesMempool();
    }

    generateArray(obj: any): Array<any> {
        return Object.keys(obj).map((key) => obj[key]);
    }

    filter(): void {
        if (this._filterHash) {
            this.unconfirmedTxsFiltered = this.unconfirmedTxs.filter(x => x.txHash.includes(this._filterHash));
        } else {
            this.unconfirmedTxsFiltered = this.unconfirmedTxs;
        }

        this.totalNumberUpdate.emit(this.unconfirmedTxs.length);
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

    topLatency(nodes: any[], maxTopNumber: number = 5): any[] {
        const result = nodes.sort((n1, n2) => n1.latency - n2.latency).slice(0, maxTopNumber);
        return result;
    }
}
