import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { PageResultModel, BaseTxModel, TxTypeEnum } from '../../models';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-tx-list-table',
    templateUrl: `./tx-list-table.component.html`,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('.5s ease-in', style({ opacity: '1' }))
            ])
        ])
    ]
})
export class TxListTableComponent implements OnChanges {
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

    getTypeName(index: number): string {
        return TxTypeEnum[index];
    }
}
