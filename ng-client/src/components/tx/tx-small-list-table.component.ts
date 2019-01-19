import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PageResultModel, BaseTxModel } from '../../models';

@Component({
    selector: 'app-small-tx-list-table',
    templateUrl: `./tx-list-table.component.html`
})
export class SmallTxListTableComponent implements OnChanges {
    @Input() model: PageResultModel<BaseTxModel>;
    @Output() emitGetPage: EventEmitter<any> = new EventEmitter();
    isLoading: boolean;

    constructor() {
        this.isLoading = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model.currentValue) {
            this.isLoading = false;
        }
    }

    update(page: number) {
        this.isLoading = true;
        this.emitGetPage.emit(page);
    }
}
