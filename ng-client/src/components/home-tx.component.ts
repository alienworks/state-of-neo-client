import { Component } from '@angular/core';
import { TxTypeEnum } from '../models';

@Component({
    selector: `app-home-tx`,
    templateUrl: `./home-tx.component.html`,
    styleUrls: [ './home-tx.component.css' ],
})
export class HomeTxComponent  {
    model = {
        type: 128,
        hash: '	0xedf63b12438941683b35d0a5395138e5d5fcfc5ad4a914e8a9689cbdec064b2f',
        from: 'Aeogee9jqqo3PJcosYVENHB7P7uLVYzHy4',
        to: 'AFpXwLKa1LiJc3M1c7hvtgQGNM6nt1wyR3',
        timestamp: 1547471169,
        assets: [{
            type: 'GAS',
            amount: 123
        }, {
            type: 'NEO',
            amount: 124
        }]
    };

    get iconClass(): string {
        if (this.model.type === TxTypeEnum.MinerTransaction) {
            return 'fas fa-hammer';
        }
        else if (this.model.type === TxTypeEnum.InvocationTransaction) {
            return 'fa fa-paper-plane';
        }
        else if (this.model.type === TxTypeEnum.ClaimTransaction) {
            return 'fa fa-cubes';
        }
        else if (this.model.type === TxTypeEnum.ContractTransaction) {
            return 'fas fa-handshake';
        }

        return 'fas fa-handshake';
    }

    getTypeName(index: number): string {
        return TxTypeEnum[index];
    }

    get mainAsset() {
        return this.model.assets.sort((x, y) => y.amount - x.amount)[0];
    }
}