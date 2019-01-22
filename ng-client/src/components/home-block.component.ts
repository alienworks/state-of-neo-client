import { Component } from '@angular/core';

@Component({
    selector: `app-home-block`,
    templateUrl: `./home-block.component.html`,
    styleUrls: [
        './home-block.component.css'
    ]
})
export class HomeBlockComponent  {
    model = {
        height: 333112,
        validator: '025bdf3f181f53e969622',
        transactions: 15,
        created: new Date(),
        fees: 0.002,
        time: 17
    };
}