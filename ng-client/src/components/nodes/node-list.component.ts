import { Component, OnInit } from '@angular/core';

import { NodeService } from '../../core/services/data/node.service';

@Component({
    selector: `app-node-list`,
    templateUrl: './node-list.component.html',
    styleUrls: ['./node-list.component.css']
})
export class NodeListComponent implements OnInit {
    allNodes: any[];

    constructor(private _nodeService: NodeService) { }

    ngOnInit(): void {
        this.allNodes = this._nodeService.getNodes();

        this._nodeService.updateNodes.subscribe((nodes: any[]) => this.allNodes = nodes);
    }

    getClassForNodeLatency(node: any) {
        if (node.latency && node.latency < 500) {
            return 'text-success';
        } else if (node.latency >= 500 && node.latency < 2500) {
            return 'text-warning';
        } else {
            return 'text-danger';
        }
    }
}
