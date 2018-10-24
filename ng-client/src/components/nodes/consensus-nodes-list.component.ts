import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../core/services/data/node.service';
import { ConsensusNodeModel } from '../../models';

@Component({
    selector: 'app-consensus-list',
    templateUrl: './consensus-nodes-list.component.html'
})
export class ConsensusNodesListComponent implements OnInit {
    nodes: ConsensusNodeModel[];

    constructor(private _nodeService: NodeService) { }

    ngOnInit(): void {
        this._nodeService.getConsensusNodes()
            .subscribe(data => {
                this.nodes = data.json() as ConsensusNodeModel[];
            }, err => {
                console.error(`get consensus error`, err);
            });
    }

    getConsensusOnly() {
        return this.nodes.filter(x => x.Active);
    }

    showNodeInfo(pk: string): void {
        const node = this.nodes.find(x => x.PublicKey === pk);
        node.ShowInfo = !node.ShowInfo;
    }

    getLogo(logo: string): string {
        return `https://neo.org/${logo.substr(2)}`;
    }

    getSocialLinks(str: string): any[] {
        const couplesAsString = str.split(';');
        const couples = [];
        couplesAsString.forEach(x => {
            const couple = x.split(':');
            couples.push({
                type: couple[0].toLowerCase(),
                value: this.getSocialLinkHref(couple[0].toLowerCase(), couple[1])
            });
        });

        return couples;
    }

    private getSocialLinkHref(type: string, value: string): string {
        let result = ``;
        if (type === 'twitter') {
            result = `https://twitter.com/${value}`;
        }
        if (type === 'facebook') {
            result = `https://www.facebook.com/${value}`;
        }
        if (type === 'weibo') {
            result = `https://weibo.com/${value}`;
        }
        if (type === 'github') {
            result = `https://github.com/${value}`;
        }
        return result;
    }
}
