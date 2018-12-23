import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class CommonStateService {
    public currentRoute = new BehaviorSubject<string>('home');
    
    constructor() {        
        
    }

    changeRoute(route: string) {
        this.currentRoute.next(route);
    }
}