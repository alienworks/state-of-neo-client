import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/core/services/data';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-nav-search',
    templateUrl: './search.component.html'
})
export class SearchComponent {
    input: string;
    error: string;

    constructor(
        private searchService: SearchService,
        private router: Router,
        private toast: ToastrService) { }

    search() {
        this.searchService.find(this.input)
            .subscribe(res => {
                const response = res.json() as any;

                if (response.route && response.value) {
                    this.router.navigate([`${response.route}/${response.value}`]);
                    this.input = ``;
                } else {
                    this.toast.warning('Your input had no match');
                }
            }, err => this.toast.error('Incorect input'));
    }
}
