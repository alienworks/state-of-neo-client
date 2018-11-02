import { Component, OnInit } from '@angular/core';
import { UnitOfTime } from '../../models';

@Component({
    templateUrl: './tx-index.component.html'
})
export class TxIndexComponent {
    unitOfTime = UnitOfTime.Day;
}
