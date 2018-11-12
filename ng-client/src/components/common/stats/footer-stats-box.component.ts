import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-footer-stats-box',
    templateUrl: './footer-stats-box.component.html'
})
export class FooterStatsBoxComponent {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() icon: string;
    @Input() link: string;
    @Input() value: number;
}
