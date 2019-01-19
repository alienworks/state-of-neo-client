import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from '../../core/services/data/node.service';
import { CommonStateService } from '../../core/services';
import { PageResultModel, BaseNodeModel } from '../../models';
import { BlockService } from '../../core/services/data';

@Component({
    selector: `app-node-list`,
    templateUrl: './node-list.component.html',
    styleUrls: ['./node-list.component.css']
})
export class NodeListComponent implements OnInit, OnDestroy {
    pageResults: PageResultModel<BaseNodeModel>;
    bestBlock: number;
    isLoading = false;
    interval: number;
    page = 1;
    nodes: any[] = [];
    nodeNameFilter: string = '';
    countryFilter: any;
    countriesFilterConfig: any = {
        displayKey: 'location',
        search: true,
        placeholder: 'Location'
    };
    filteredNodes: any = [];
    countries: any = [];
    typeFilter: string = '';
    statusFilter: string = '';

    constructor(
        private nodeService: NodeService,
        private state: CommonStateService,
        private blockService: BlockService) { }

    filter(): void {
        this.filteredNodes = this.nodes;

        if (this.nodeNameFilter.length) {
            this.filteredNodes = this.filteredNodes.filter(x => x.url.includes(this.nodeNameFilter));
        }

        if (this.countryFilter && this.countryFilter.length) {
            this.filteredNodes = this.filteredNodes.filter(x => this.countryFilter.find(c => c.location == x.location) != null);
        }

        if (this.typeFilter) {
            this.filteredNodes = this.filteredNodes.filter(x => x.type == this.typeFilter);
        }

        if (this.statusFilter) {
            this.filteredNodes = this.filteredNodes.filter(x => this.statusFilter == 'Online' ? x.blockCount : !x.blockCount);
        }
    }

    ngOnInit(): void {
        this.state.changeRoute('nodes');

        this.nodes = this.nodeService.getNodes();
        this.nodeService.startUpdatingAll();
        this.nodeService.updateNodes.subscribe((x: any[]) => {
            this.nodes = x;
            this.filter();
            this.setNodeCountries();
        });

        this.bestBlock = this.blockService.bestBlock;
        this.blockService.bestBlockChanged.subscribe((block: number) => this.bestBlock = block);

        // this.getPage(1);
    }

    ngOnDestroy(): void {
        this.nodeService.stopUpdatingAll();
    }

    setNodeCountries() {
        var uniques = new Set(this.nodes.map(item => item.location));
        uniques.forEach(x => {
            let item = this.nodes.find(z => z.location == x);
            this.countries.push({location: item.location, flagUrl: item.flagUrl});
        });

        this.countries.sort((x, y) => x.location - y.location);
        this.countries = [...this.countries];
    }

    getPage(page: number): void {
        this.isLoading = true;
        this.nodeService.getNodesApi(page)
            .subscribe(pageResults => {
                this.pageResults = pageResults.json() as PageResultModel<BaseNodeModel>;
                this.nodes = this.pageResults.items;
                this.filteredNodes = this.nodes;

                this.isLoading = false;
                this.updateNodesList();

                this.setNodeCountries();

                this.interval = window.setInterval(() => {
                    this.updateNodesList();
                }, 5000);
            });
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
