import { Component } from '@angular/core';
import { TxTypeEnum } from '../models';

@Component({
    selector: `app-home-tx`,
    templateUrl: `./home-tx.component.html`
})
export class HomeTxComponent  {
    model = {
        type: 'Miner',
        hash: '	0xedf63b12438941683b35d0a5395138e5d5fcfc5ad4a914e8a9689cbdec064b2f',
        from: 'Aeogee9jqqo3PJcosYVENHB7P7uLVYzHy4',
        to: 'AFpXwLKa1LiJc3M1c7hvtgQGNM6nt1wyR3',
        assets: [{
            type: 'GAS',
            amount: 123
        }]
    };

    getTypeName(index: number): string {
        return TxTypeEnum[index];
    }
}