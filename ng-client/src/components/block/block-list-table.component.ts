import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { BlockListModel } from '../../models/block.models';
import { PageResultModel } from '../../models';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-block-list-table',
    templateUrl: `./block-list-table.component.html`,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('.5s ease-in', style({ opacity: '1' }))
            ])
        ])
    ]
})
export class BlockListTableComponent implements OnChanges {
    @Input() model: PageResultModel<BlockListModel>;
    @Output() emitGetPage: EventEmitter<any> = new EventEmitter();

    isLoading: boolean;

    get paginateConfig() {
        return {
            itemsPerPage: this.model ? this.model.metaData.pageSize : 32,
            currentPage: this.model ? this.model.metaData.pageNumber : 1,
            totalItems: this.model ? this.model.metaData.totalItemCount : 1
        };
    }

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
