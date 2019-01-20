import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-percent-bar',
    templateUrl: './percent-bar.component.html'
})
export class PercentBarComponent implements OnInit {
    @Input() total: number;
    @Input() current: number;
    @Input() percent: number = null;
    @Input() title: string;

    ngOnInit(): void {
        if (!this.percent) {
            this.updatePercent();
        }

        console.log(`PERCENTAGE ${this.percent}`);
    }

    updatePercent(): void {
        const calculatedPercent = (100 * this.current) / this.total;
        this.percent = parseFloat((Math.round(calculatedPercent * 100) / 100).toFixed(1));
    }  
}
