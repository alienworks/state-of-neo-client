import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html'
})
export class LoaderComponent {
    @Input() title: string;
    @Input() iconScale = 4;
    @Input() textPosition = 'text-center';
    @Input() padding = 10;
}
