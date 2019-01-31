import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { TxTypeEnum, TxAssetsModel } from '../models';
import { TransactionSignalRService } from 'src/core/services/signal-r/tx-signal-r.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { BaseComponent } from './base/base.component';

@Component({
    selector: `app-home-tx`,
    templateUrl: `./home-tx.component.html`,
    styleUrls: ['./home-tx.component.css'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('.5s ease-in', style({ opacity: '1' }))
            ])
        ])
    ]
})
export class HomeTxComponent extends BaseComponent implements OnInit, OnDestroy {
    initialTransactionsEvent = new EventEmitter<TxAssetsModel[]>();
    newTransactionsEvent = new EventEmitter<TxAssetsModel[]>();
    transactions: TxAssetsModel[];

    constructor(private txSignalRService: TransactionSignalRService) { super(); }

    ngOnInit(): void {
        this.txSignalRService.registerAdditionalEvent('list', this.initialTransactionsEvent);
        this.addSubsctiption(
            this.initialTransactionsEvent.subscribe((x: TxAssetsModel[]) => this.transactions = x)
        );

        this.txSignalRService.registerAdditionalEvent('new', this.newTransactionsEvent);
        this.addSubsctiption(
            this.newTransactionsEvent.subscribe((x: TxAssetsModel[]) => {
                if (x.length < 10) {
                    for (const iterator of x) {
                        this.transactions.pop();
                    }
                    for (const tx of x) {
                        this.transactions.unshift(tx);
                    }
                } else {
                    this.transactions = x;
                }
            })
        );

        this.addSubsctiption(
            this.txSignalRService.connectionEstablished.subscribe((x: boolean) => {
                if (x) {
                    this.txSignalRService.invokeOnServerEvent('InitInfo', 'caller');
                }
            })
        );

        if (this.txSignalRService.connectionIsEstablished) {
            this.txSignalRService.invokeOnServerEvent('InitInfo', 'caller');
        }
    }

    ngOnDestroy(): void {
        this.clearSubscriptions();
    }

    iconClass(type: number): string {
        if (type === TxTypeEnum.MinerTransaction) {
            return 'fas fa-hammer';
        } else if (type === TxTypeEnum.InvocationTransaction) {
            return 'fa fa-paper-plane';
        } else if (type === TxTypeEnum.ClaimTransaction) {
            return 'fa fa-cubes';
        } else if (type === TxTypeEnum.ContractTransaction) {
            return 'fas fa-handshake';
        }

        return 'fas fa-handshake';
    }

    getTypeName(index: number): string {
        return TxTypeEnum[index];
    }

    getReceivedAssetsAddresses(tx: TxAssetsModel): string[] {
        return tx.receivedAssets.map(x => x.toAddress);
    }

    getReceivedAssetsMap(tx: TxAssetsModel): Map<number, string> {
        const map = new Map<number, string>();

        tx.receivedAssets.forEach(x => {
            map.set(x.amount, x.name);
        });

        return map;
    }
}
