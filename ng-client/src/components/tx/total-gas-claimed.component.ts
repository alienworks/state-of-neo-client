import { Component, OnInit } from '@angular/core';
import { TxService } from '../../core/services/data';

@Component({
    selector: 'app-total-gas-claimed',
    templateUrl: './total-gas-claimed.component.html'
})
export class TotalGasClaimedComponent implements OnInit {
    isLoading = true;
    total: number;
    constructor(private txService: TxService) { }

    ngOnInit(): void {
        this.txService.getTotalGasClaimed()
            .subscribe(x => {
                this.total = x.json() as number;
                this.isLoading = false;
            }, err => console.log(err));
    }
}
