import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { AssetListModel } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    selector: 'app-asset-list-table',
    templateUrl: `./asset-list-table.component.html`
})
export class AssetListTableComponent implements OnChanges {
    @Input() model: PageResultModel<AssetListModel>;
    @Input() name: string;
    @Output() emitModelUpdate: EventEmitter<any> = new EventEmitter();
    isLoading: boolean;

    get paginateConfig() {
        return {
            id: 'server-' + this.name,
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

    getPage(page: number) {
        this.isLoading = true;
        this.emitModelUpdate.emit(page);
    }
}
