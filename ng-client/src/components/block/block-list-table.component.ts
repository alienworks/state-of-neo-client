import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { BlockListModel } from '../../models/block.models';
import { PageResultModel } from '../../models';

@Component({
    selector: 'app-block-list-table',
    templateUrl: `./block-list-table.component.html`
})
export class BlockListTableComponent implements OnChanges {
    @Input() model: PageResultModel<BlockListModel>;
    @Output() emitGetPage: EventEmitter<any> = new EventEmitter();

    isLoading: boolean;

    get paginateConfig() {
        return {
            itemsPerPage: this.model ? this.model.metaData.PageSize : 32,
            currentPage: this.model ? this.model.metaData.PageNumber : 1,
            totalItems: this.model ? this.model.metaData.TotalItemCount : 1
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
