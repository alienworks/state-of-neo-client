import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../core/services/node.service';

@Component({
    selector: 'app-consensus-list',
    templateUrl: './consensus-nodes-list.component.html'
})
export class ConsensusNodesListComponent implements OnInit {
    nodes: any[];

    constructor(private _nodeService: NodeService) { }

    ngOnInit(): void {
        this._nodeService.getConsensusNodes()
            .subscribe(data => {
                this.nodes = data.json();
            }, err => {
                console.error(`get consensus error`, err);
            });
    }
}
