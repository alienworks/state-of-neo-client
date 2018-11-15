import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TxService, NodeService } from '../../core/services/data';
import { TxUnconfirmedDetailsViewModel, TxTypeEnum } from '../../models';

import * as CONST from './../../core/common/constants';

@Component({
    templateUrl: './tx-unconfirmed.component.html'
})
export class TxUnconfirmedComponent implements OnInit {
    tx: TxUnconfirmedDetailsViewModel;

    hash: string;
    url: string;

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
                        .subscribe(x => {
                            this.findTx(x.json().successUrl);
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
                this.tx = y.json().result as TxUnconfirmedDetailsViewModel;
                console.log('unconfirmed', this.tx);
            }, err => console.log(err));
    }

    getTypeName(): string {
        if (this.tx === null) { return ''; }
        return TxTypeEnum[this.tx.type];
    }

    getAssetName(value: string): string {
        return CONST.Assets[value];
    }
}
