import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from '../../core/services/data/node.service';
import { CommonStateService } from '../../core/services';
import { PageResultModel, BaseNodeModel } from '../../models';
import { BlockService } from '../../core/services/data';
import { BaseComponent } from '../base/base.component';

declare var $;

@Component({
    selector: `app-node-list`,
    templateUrl: './node-list.component.html',
    styleUrls: ['./node-list.component.css']
})
export class NodeListComponent extends BaseComponent implements OnInit, OnDestroy {
    pageResults: PageResultModel<BaseNodeModel>;
    bestBlock: number;
    isLoading = false;
    interval: number;
    page = 1;
    nodes: any[] = [];
    nodeNameFilter = '';
    countryFilter: any;
    countriesFilterConfig: any = {
        displayKey: 'location',
        search: true,
        placeholder: 'Location'
    };
    filteredNodes: any = [];
    countries: any = [];
    typeFilter = '';
    statusFilter = '';

    constructor(
        private nodeService: NodeService,
        private state: CommonStateService,
        private blockService: BlockService) {
        super();
    }

    filter(): void {
        this.filteredNodes = this.nodes;

        if (this.nodeNameFilter.length) {
            this.filteredNodes = this.filteredNodes.filter(x => x.url.includes(this.nodeNameFilter));
        }

        if (this.countryFilter && this.countryFilter.length) {
            this.filteredNodes = this.filteredNodes.filter(x => this.countryFilter.find(c => c.location === x.location) != null);
        }

        if (this.typeFilter) {
            this.filteredNodes = this.filteredNodes.filter(x => x.type === this.typeFilter);
        }

        if (this.statusFilter) {
            this.filteredNodes = this.filteredNodes.filter(x => this.statusFilter === 'Online' ? x.blockCount : !x.blockCount);
        }
    }

    ngOnInit(): void {
        this.state.changeRoute('nodes');
        this.nodeService.startUpdatingAll();

        this.nodes = this.nodeService.getNodes();

        this.addSubscription(
            this.nodeService.updateNodes.subscribe((x: any[]) => {
                this.nodes = x;
                this.filter();
                this.setNodeCountries();
            })
        );

        this.bestBlock = this.blockService.bestBlock;
        this.addSubscription(
            this.blockService.bestBlockChanged.subscribe((block: number) => this.bestBlock = block)
        );

        $('.ngx-dropdown-container > .ngx-dropdown-button').css('border', '2px solid #E5E7E9');
        $('.ngx-dropdown-container > .ngx-dropdown-button').css('height', '34px');
    }

    ngOnDestroy(): void {
        this.nodeService.stopUpdatingAll();
        this.clearSubscriptions();
    }

    setNodeCountries() {
        const uniques = new Set(this.nodes.map(item => item.location));
        uniques.forEach(x => {
            const item = this.nodes.find(z => z.location === x);
            this.countries.push({ location: item.location, flagUrl: item.flagUrl });
        });

        this.countries.sort((x, y) => x.location - y.location);
        this.countries = [...this.countries];
    }

    updateNodesList() {
        this.pageResults.items.forEach(x => {
            this.nodeService.getBlockCount(x);
            this.nodeService.getVersion(x);
            this.nodeService.getConnectionsCount(x);
        });
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
