import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: `./tx-details.component.html`
})
export class TxDetailsComponent implements OnInit {
    hash: string;

    constructor(private route: ActivatedRoute) {    }

    ngOnInit(): void {
        this.hash = this.route.snapshot.paramMap.get('hash');
    }
}
