import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PageResultModel, BaseTxModel, TxTypeEnum } from '../../models';

@Component({
    selector: 'app-tx-small-list',
    templateUrl: `./tx-small-list.component.html`,
    styleUrls: ['./tx-small-list.component.css']
})
export class TxSmallListComponent implements OnChanges {
    @Input() model: PageResultModel<BaseTxModel>;
    @Output() emitGetPage: EventEmitter<any> = new EventEmitter();
    isLoading: boolean;

    constructor() {
        this.isLoading = true;
    }

    getPage(page: number) {
        this.isLoading = true;
        this.emitGetPage.emit(page);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model) {
            this.isLoading = false;
        }
    }

    getTypeName(index: number): string {
        return TxTypeEnum[index];
    }
}
