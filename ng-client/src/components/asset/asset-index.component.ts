import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../core/services/data';
import { AssetListModel } from '../../models';
import { PageResultModel } from '../../models';

@Component({
    templateUrl: './asset-index.component.html'
})
export class AssetIndexComponent implements OnInit {
    global: PageResultModel<AssetListModel>;
    nep: PageResultModel<AssetListModel>;

    constructor(private assetsService: AssetService) {
    }

    ngOnInit(): void {
        this.getGlobalPage(1);
        this.getNepPage(1);
    }

    getGlobalPage(page: number): void {
        this.assetsService.getAssetsPage(page, 16)
            .subscribe(x => {
                this.global = x.json() as PageResultModel<AssetListModel>;
                console.log(this.global);
            }, err => {
                console.log(err);
            });
    }

    getNepPage(page: number): void {
        this.assetsService.getAssetsPage(page, 16, false)
            .subscribe(x => {
                this.nep = x.json() as PageResultModel<AssetListModel>;
                console.log(this.global);
            }, err => {
                console.log(err);
            });
    }
}
