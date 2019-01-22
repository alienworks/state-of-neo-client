import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../core/services/data/node.service';
import { ConsensusNodeModel } from '../../models';

@Component({
    selector: 'app-consensus-list',
    templateUrl: './consensus-nodes-list.component.html'
})
export class ConsensusNodesListComponent implements OnInit {
    consensusNodes: ConsensusNodeModel[];
    candidateNodes: ConsensusNodeModel[];

    constructor(private _nodeService: NodeService) { }

    ngOnInit(): void {
        this._nodeService.getConsensusNodes()
            .subscribe(data => {
                console.log(data)
                var nodes = data;

                this.consensusNodes = nodes.filter(x => x.Active);
                this.candidateNodes = nodes.filter(x => !x.Active);

                this.consensusNodes.sort((x, y) => {
                    if (x.Info.Organization == 'NEO Foundation') {
                        return 1;
                    }

                    return x.Info.Organization > y.Info.Organization ? 1 : -1;
                });
            }, err => {
                console.error(`get consensus error`, err);
            });
    }

    showNodeInfo(pk: string): void {
        const node = this.consensusNodes.find(x => x.PublicKey === pk);
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
        else if (type === 'facebook') {
            result = `https://www.facebook.com/${value}`;
        }
        else if (type === 'weibo') {
            result = `https://weibo.com/${value}`;
        }
        else if (type === 'github') {
            result = `https://github.com/${value}`;
        }

        return result;
    }
}
