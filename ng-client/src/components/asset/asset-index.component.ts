import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../core/services/data';

@Component({
    templateUrl: './asset-index.component.html'
})
export class AssetIndexComponent implements OnInit {

    constructor(private assets: AssetService) {
    }

    ngOnInit(): void {
    }
}
