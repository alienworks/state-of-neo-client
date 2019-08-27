import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/components/base/base.component';

@Component({
    selector: 'app-tx-unconfirmed-index',
    templateUrl: `./tx-unconfirmed-index.component.html`
})
export class TxUnconfirmedIndexComponent extends BaseComponent implements OnInit, OnDestroy {
    unconfirmedTxTotal: number;
    constructor() { super();}

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {
        
    }

    subscribeForTotal(totalUnconfirmedTxNumber: number) {
        this.unconfirmedTxTotal = totalUnconfirmedTxNumber;
    }
}
