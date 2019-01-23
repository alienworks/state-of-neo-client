import { Component, OnInit } from '@angular/core';
import { CommonStateService } from '../../core/services';
import { StatsSignalRService } from '../../core/services/signal-r';

@Component({
    templateUrl: './stats-index.component.html'
})
export class StatsIndexComponent implements OnInit {

    constructor(
        private state: CommonStateService,
        private statsSignalR: StatsSignalRService
    ) {
    }

    ngOnInit() {
        this.state.changeRoute('stats');

    }

}
