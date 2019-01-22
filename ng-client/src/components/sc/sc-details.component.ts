import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonStateService } from 'src/core/services';
import { SmartContractService } from 'src/core/services/data';
import { SmartContractDetailsModel } from 'src/models';

@Component({
    templateUrl: './sc-details.component.html'
})
export class SmartContractDetailsComponent implements OnInit {
    model: SmartContractDetailsModel = new SmartContractDetailsModel();
    isLoading: boolean;
    hash: string;

    constructor(
        private route: ActivatedRoute,
        private state: CommonStateService, 
        private scService: SmartContractService
    ) { }

    ngOnInit(): void {
        this.state.changeRoute('Smart Contract');

        this.isLoading = true;
        this.hash = this.route.snapshot.paramMap.get('hash');

        this.route.params.subscribe(params => {
            this.hash = params['hash'];

            this.scService.get(this.hash)
                .subscribe(x => {
                    this.model = x;
                    this.isLoading = false;
                    console.log(x);
                }, err => console.log(err));
        });
    }
}
