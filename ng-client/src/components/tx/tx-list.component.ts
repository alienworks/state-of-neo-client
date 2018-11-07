import { Component, Input } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';

@Component({
    selector: 'app-tx-list',
    templateUrl: `./tx-list.component.html`
})
export class TxListComponent {
    @Input() pageResults: PageResultModel<BaseTxModel>;
}
