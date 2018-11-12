import { Input, Component } from '@angular/core';

@Component({
    selector: 'app-footer-stats-tr',
    templateUrl: './footer-stats-tr.component.html'
})
export class FooterStatsTrComponent {
    @Input() title: string;
    @Input() value: number;
}
