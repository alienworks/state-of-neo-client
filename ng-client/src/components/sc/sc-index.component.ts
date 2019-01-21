import { Component, OnInit } from '@angular/core';
import { CommonStateService } from 'src/core/services';
import { SmartContractService } from 'src/core/services/data';
import { SmartContractListModel } from 'src/models';

@Component({
    templateUrl: './sc-index.component.html'
})
export class SmartContractIndexComponent implements OnInit {
    contracts: SmartContractListModel[];

    constructor(private state: CommonStateService, private scService: SmartContractService) { }

    ngOnInit(): void {
        this.state.changeRoute('Smart Contracts');

        this.scService.getAll().subscribe(x => {
            this.contracts = x;
        }, err => console.log(err));
    }
}
