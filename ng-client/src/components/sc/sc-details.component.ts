import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonStateService } from 'src/core/services';
import { SmartContractService } from 'src/core/services/data';
import { SmartContractDetailsModel, NotificationModel, PageResultModel, BaseTxModel } from 'src/models';
import { NotificationsSignalRService } from 'src/core/services/signal-r';

@Component({
    templateUrl: './sc-details.component.html',
    styleUrls: ['./sc-details.component.css']
})
export class SmartContractDetailsComponent implements OnInit, OnDestroy {
    model = new SmartContractDetailsModel();
    isLoading: boolean;
    hash: string;
    currentNotifications: NotificationModel[];
    allNotifications: NotificationModel[];
    pausedNotifications = false;
    transactions: PageResultModel<BaseTxModel>;

    constructor(
        private route: ActivatedRoute,
        private state: CommonStateService,
        private scService: SmartContractService,
        private notificationsSignalR: NotificationsSignalRService
    ) { }

    ngOnInit(): void {
        this.state.changeRoute('Smart Contract');

        this.isLoading = true;

        this.route.params.subscribe(params => {
            this.hash = params['hash'];

            this.getTransactionsPage(1);

            this.scService.get(this.hash)
                .subscribe(x => {
                    this.model = x;
                    this.isLoading = false;

                    console.log(x);
                }, err => console.log(err));
        });

        this.notificationsSignalR.contractNotificationUpdate.subscribe((x: NotificationModel[]) => {
            this.allNotifications = x;

            if (!this.pausedNotifications) {
                this.currentNotifications = this.allNotifications;
            }
        });

        this.notificationsSignalR.connectionEstablished.subscribe((x: Boolean) => {
            if (x) {
                this.notificationsSignalR.invokeOnServerEvent('TrackContract', this.hash);
            }
        });

        if (this.notificationsSignalR.connectionIsEstablished) {
            this.notificationsSignalR.invokeOnServerEvent('TrackContract', this.hash);
        }
    }

    ngOnDestroy(): void {
        this.notificationsSignalR.invokeOnServerEvent('Unsubscribe', this.hash);
    }

    togglePause() {
        this.pausedNotifications = !this.pausedNotifications;

        if (!this.pausedNotifications) this.currentNotifications = this.allNotifications;
    }

    getTransactionsPage(page: number): void {
        this.scService.getTransactionsPage(this.hash, page, 10)
            .subscribe(x => {
                this.transactions = x;
            }, err => {
                console.log(err);
            });
    }
}
