import { Component, Input, OnInit } from '@angular/core';
import { TxTypeEnum } from '../../models';

@Component({
    selector: 'app-tx-icon',
    templateUrl: './tx-icon.component.html'
})
export class TxIconComponent implements OnInit {
    @Input() type: TxTypeEnum;
    iconClass = 'fas fa-handshake';

    ngOnInit(): void {
        if (this.type === TxTypeEnum.MinerTransaction) {
            this.iconClass = 'fas fa-hammer';
        } else if (this.type === TxTypeEnum.InvocationTransaction) {
            this.iconClass = 'fa fa-paper-plane';
        } else if (this.type === TxTypeEnum.ClaimTransaction) {
            this.iconClass = 'fa fa-cubes';
        } else if (this.type === TxTypeEnum.ContractTransaction) {
            this.iconClass = 'fas fa-handshake';
        }
    }
}
