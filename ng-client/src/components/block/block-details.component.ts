import { Component, Input } from '@angular/core';

@Component({
    templateUrl: `./block-details.component.html`
})
export class BlockDetailsComponent {
    @Input() hash: string;
}
