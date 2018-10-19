import { Component, OnInit } from '@angular/core';

import { NodeService } from '../../core/services/node.service';

@Component({
    selector: `app-node-list`,
    templateUrl: './node-list.component.html'
})
export class NodeListComponent implements OnInit {
    allNodes: any[];

    constructor(private _nodeService: NodeService) { }

    ngOnInit(): void {
        this.allNodes = this._nodeService.getNodes();

        this._nodeService.updateNodes.subscribe((nodes: any[]) => this.allNodes = nodes);
    }
}
