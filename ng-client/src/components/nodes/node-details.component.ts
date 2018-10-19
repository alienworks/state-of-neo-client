import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: `./node-details.component.html`
})
export class NodeDetailsComponent implements OnInit {
    id: number;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.id = +this.route.snapshot.paramMap.get('id');
    }
}
