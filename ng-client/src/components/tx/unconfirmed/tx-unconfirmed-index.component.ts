import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/components/base/base.component';
import {CommonStateService} from '../../../core/services';

@Component({
    selector: 'app-tx-unconfirmed-index',
    templateUrl: `./tx-unconfirmed-index.component.html`
})
export class TxUnconfirmedIndexComponent extends BaseComponent implements OnInit, OnDestroy {
    unconfirmedTxTotal: number;
    txFilter = true;
    filterHash = '';

    constructor(
      private state: CommonStateService
    ) {
      super();
    }

    ngOnInit(): void {
      this.state.changeRoute('transactions-unconfirmed');
    }

    ngOnDestroy(): void {

    }

    subscribeForTotal(totalUnconfirmedTxNumber: number) {
        this.unconfirmedTxTotal = totalUnconfirmedTxNumber;
    }
}
