import { Component, OnInit, Input } from '@angular/core';
import { AssetService } from '../../core/services/data';
import { AssetListModel } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    selector: 'app-asset-list',
    templateUrl: `./asset-list.component.html`
})
export class AssetListComponent implements OnInit {
    @Input() pageSize: number;
    isLoading: boolean;
    pageResults: PageResultModel<AssetListModel>;

    constructor(
        private assets: AssetService
    ) { }

    ngOnInit(): void {
        this.getPage(1);
    }

    getPage(page: number): void {
        this.isLoading = true;
        this.assets.getAssetsPage(page, 32)
            .subscribe(x => {
                this.pageResults = x.json() as PageResultModel<AssetListModel>;
                this.isLoading = false;
                console.log(this.pageResults);
            }, err => {
                this.isLoading = false;
                console.log(err);
            });
    }
}
