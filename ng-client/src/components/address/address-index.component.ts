import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../core/services/data';

@Component({
    templateUrl: './address-index.component.html'
})
export class AddressIndexComponent implements OnInit {

    constructor(private addresses: AddressService) {
    }

    ngOnInit(): void {
    }
}
