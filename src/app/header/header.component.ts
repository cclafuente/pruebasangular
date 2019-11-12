import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls : ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    userIsAuthenticated = false;

    private authListenerSubs: Subscription;

    constructor(private authService: AuthService){}

    ngOnInit(){
        this.authListenerSubs = this.authService.getAuthStatusListener().
        subscribe(isAuthenicated => {
            this.userIsAuthenticated = isAuthenicated;
        });
    }

    ngOnDestroy(){
        this.authListenerSubs.unsubscribe();

    }

}
