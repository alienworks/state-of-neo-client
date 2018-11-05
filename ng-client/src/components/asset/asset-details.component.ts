import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetService } from '../../core/services/data';
import { AssetDetailsModel } from '../../models';

@Component({
    templateUrl: `./asset-details.component.html`
})
export class AssetDetailsComponent implements OnInit {
    isLoading: boolean;
    hash: string;
    model: AssetDetailsModel = new AssetDetailsModel();

    constructor(private route: ActivatedRoute,
        private assets: AssetService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.hash = params['hash'];

            this.isLoading = true;
            this.assets.getAsset(this.hash)
                .subscribe(x => {
                    this.isLoading = false;
                    this.model = x.json() as AssetDetailsModel;

                    console.log(this.model);
                });
        });
    }
}
