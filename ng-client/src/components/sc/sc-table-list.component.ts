import { Component, Input, OnInit } from '@angular/core';
import { SmartContractListModel } from 'src/models';

@Component({
    selector: 'app-sc-table',
    templateUrl: './sc-table-list.component.html'
})
export class SmartContractTableListComponent implements OnInit {
    @Input() model: SmartContractListModel[];
    @Input() pageSize: number = 32;

    filteredModel: SmartContractListModel[];
    input: string;

    ngOnInit(): void {
        this.filteredModel = this.model;
    }

    filter() {
        this.filteredModel = this.model;

        this.filteredModel = this.model.filter(x =>
            x.author.toLowerCase().includes(this.input) ||
            x.name.toLowerCase().includes(this.input) ||
            x.hash.includes(this.input));
    }
}
