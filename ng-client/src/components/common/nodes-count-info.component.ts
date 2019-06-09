import { Component, OnInit, EventEmitter, OnDestroy, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { PeersSignalRService } from 'src/core/services/signal-r';

@Component({
    selector: 'app-nodes-count-info',
    templateUrl: './nodes-count-info.component.html'
})
export class NodesCountInfoComponent extends BaseComponent implements OnInit, OnDestroy {
    @Input() showTitle = true;

    totalPeersFound: number;
    totalPeersTracked: number;

    totalPeersFoundUpdate = new EventEmitter<number>();
    totalPeersTrackedUpdate = new EventEmitter<number>();

    constructor(private peersHub: PeersSignalRService) {
        super();
    }

    ngOnInit(): void {
        this.peersHub.registerAdditionalEvent('total-found', this.totalPeersFoundUpdate);
        this.addSubsctiption(
            this.totalPeersFoundUpdate.subscribe((x: number) => {
                this.totalPeersFound = x;
            })
        );

        this.peersHub.registerAdditionalEvent('total-tracked', this.totalPeersTrackedUpdate);
        this.addSubsctiption(
            this.totalPeersTrackedUpdate.subscribe((x: number) => {
                this.totalPeersTracked = x
            })
        );

        this.addSubsctiption(
            this.peersHub.connectionEstablished.subscribe(x => {
                if (x) {
                    this.peersHub.invokeOnServerEvent('InitInfo', 'caller');
                }
            })
        );

        if (this.peersHub.connectionIsEstablished) {
            this.peersHub.invokeOnServerEvent('InitInfo', 'caller');
        }
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }
}
