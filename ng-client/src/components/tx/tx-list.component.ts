import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';

@Component({
    selector: 'app-tx-list',
    templateUrl: `./tx-list.component.html`
})
export class TxListComponent {
    @Input() model: PageResultModel<BaseTxModel>;
    @Output() emitGetPage: EventEmitter<any> = new EventEmitter();

    getPage(page: number) {
        this.emitGetPage.emit(page);
    }
}
