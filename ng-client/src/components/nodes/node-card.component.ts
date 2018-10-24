import { Component, Input } from '@angular/core';
import { BlockService } from '../../core/services/data/block.service';

declare var $;

@Component({
    selector: `app-node-card`,
    templateUrl: './node-card.component.html'
})
export class NodeCardComponent {
    latestBlock = 0;
    @Input() node: any;
    @Input() index: number;

    constructor(private _blockService: BlockService) { }

    private subscribeToEvents() {
        this._blockService.bestBlockChanged.subscribe((block: number) => {
            this.latestBlock = block;
        });
    }

    hoverOffNode(node: any) {
        const map = $('#world-map').vectorMap('get', 'mapObject');
        map.clearSelectedMarkers();
        map.label.css('display', 'none');
    }

    hoverNode(node: any) {
        const marker = this.getMarkerByName(this.getNodeDisplayText(node));
        marker.element.isHovered = true;

        const coords = {
            x: marker.element.properties.cx,
            y: marker.element.properties.cy
        };

        const index = marker.element.properties['data-index'];

        const map = $('#world-map').vectorMap('get', 'mapObject');
        map.setSelectedMarkers(index);
    }

    nodeIsBehind(node: any) {
        return node.blockCount < this._blockService.bestBlock;
    }

    getClassForNodeBlocks(node: any) {
        const difference = this._blockService.bestBlock - node.blockCount;
        if (difference <= 1) {
            return '';
        }

        if (difference > 1 && difference < 10000) {
            return 'text-warning';
        }

        return 'text-danger';
    }

    getClassForNodeUptime(node: any) {
        if (node.upTime && node.upTime >= 98) {
            return 'text-success';
        } else if (node.upTime < 98 && node.upTime >= 93) {
            return 'text-warning';
        } else {
            return 'text-danger';
        }
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

    getNodeDisplayText(node: any) {
        return node.successUrl ? node.successUrl : node.ip;
    }

    getMarkerByName(name: string): any {
        const map = $('#world-map').vectorMap('get', 'mapObject');

        for (const propName in map.markers) {
            if (map.markers[propName].config.name === name) {
                return map.markers[propName];
            }
        }
    }
}
