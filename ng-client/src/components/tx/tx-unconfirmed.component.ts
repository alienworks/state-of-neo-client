import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TxService, NodeService } from '../../core/services/data';
import { TxUnconfirmedDetailsViewModel, TxTypeEnum, TxAssetsModel, TransactedAssetModel, AssetTypeEnum } from '../../models';

import * as CONST from './../../core/common/constants';

@Component({
    templateUrl: './tx-unconfirmed.component.html'
})
export class TxUnconfirmedComponent implements OnInit {
    tx: TxUnconfirmedDetailsViewModel;
    prevtx: TransactedAssetModel[] = [];

    hash: string;
    url: string;
    raw: string;
    p = 1;

    constructor(private route: ActivatedRoute,
        private nodeService: NodeService,
        private txService: TxService) { }

    ngOnInit(): void {
        const nodeid = +this.route.snapshot.paramMap.get('nodeid');
        this.hash = this.route.snapshot.paramMap.get('hash');

        setInterval(() => {
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
                this.prevTxAssets();
                console.log('unconfirmed', this.tx);
            }, err => console.log(err));
    }

    prevTxAssets(): void {
        if (this.prevtx.length > 0) return;
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
        if (this.tx === null) { return ''; }
        return TxTypeEnum[this.tx.type];
    }

    getAssetName(value: string | number): string {
        if (typeof value === 'number') return AssetTypeEnum[value];
        return CONST.Assets[value];
    }
}
