import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TxService, NodeService, BlockService } from 'src/core/services/data';
import { CommonStateService } from 'src/core/services';
import { 
    TxUnconfirmedDetailsViewModel, 
    TransactedAssetModel, 
    AssetTypeEnum 
} from 'src/models';

import * as CONST from 'src/core/common/constants';

@Component({
    templateUrl: './tx-unconfirmed.component.html'
})
export class TxUnconfirmedComponent implements OnInit {
    interval: any;

    tx: TxUnconfirmedDetailsViewModel;
    prevtx: TransactedAssetModel[] = [];

    hash: string;
    url: string;
    raw: string;
    p = 1;

    constructor(
        private route: ActivatedRoute,
        private nodeService: NodeService,
        private blockService: BlockService,
        private state: CommonStateService,
        private txService: TxService) { }

    ngOnInit(): void {
        this.state.changeRoute('mempool tx');

        const nodeid = +this.route.snapshot.paramMap.get('nodeid');
        this.hash = this.route.snapshot.paramMap.get('hash');

        this.interval = setInterval(() => {
            if (!this.url) {
                const node = this.nodeService.allNodes.find(x => x.id === nodeid);

                if (node) {
                    this.findTx(node.successUrl);
                } else {
                    this.nodeService.getNode(nodeid)
                        .subscribe((x: any) => {
                            this.findTx(x.successUrl);
                        });
                }
            } else {
                this.findTx(this.url);
            }
        }, 2000);
    }

    private findTx(url: string) {
        this.url = url;
        this.txService.getUnconfirmed(this.url, this.hash)
            .subscribe(y => {
                this.raw = y;
                this.tx = y.result as TxUnconfirmedDetailsViewModel;

                this.blockService.getHeightByHash(this.tx.blockhash)
                    .subscribe(x => this.tx.blockHeight = x);

                this.prevTxAssets();

                console.log('unconfirmed', this.tx);

                clearInterval(this.interval);
            }, err => console.log(err));
    }

    prevTxAssets(): void {
        if (this.prevtx.length > 0) {
            return;
        }

        if (this.tx.vin && this.tx.vin.length > 0) {
            for (const input of this.tx.vin) {
                this.txService.getAssets(input.txid)
                    .subscribe(x => {
                        const assets = x;
                        const outasset = this.tx.vout.find(y => y.n === input.vout);

                        this.prevtx.push(assets.globalOutgoingAssets.find(y => y.toAddress === outasset.address));
                    }, err => console.log(`err`, err));
            }
        }
    }

    getTypeName(): string {
        if (this.tx === null) {
            return '';
        }

        return this.tx.type.substr(0, this.tx.type.indexOf('Transaction'));
    }

    getAssetName(value: string | number): string {
        return typeof value === 'number'
            ? AssetTypeEnum[value]
            : CONST.Assets[value];
    }
}
