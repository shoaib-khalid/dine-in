import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { finalize, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from 'app/config/service.config';

@Component({
    selector     : 'auth-sign-out',
    templateUrl  : './sign-out.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AuthSignOutComponent implements OnInit, OnDestroy
{
    countdown: number = 3;
    countdownMapping: any = {
        '=1'   : '# second',
        'other': '# seconds'
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //to be display the text
    titleText:string ='You have signed out!';
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _authService: AuthService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _cookieService: CookieService,
        private _apiServer: AppConfig
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        // Sign out
        this._authService.signOut();

        this._cookieService.delete('CustomerId','/', this._apiServer.settings.storeFrontDomain);
        this._cookieService.delete('RefreshToken','/', this._apiServer.settings.storeFrontDomain);
        this._cookieService.delete('AccessToken','/', this._apiServer.settings.storeFrontDomain);
        
        // Redirect after the countdown
        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    
                    // redirectURL
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL')
                    // store front domain, to be used to compare with redirectURL
                    const storeFrontDomain = this._apiServer.settings.storeFrontDomain;
                    
                    if (this._activatedRoute.snapshot.queryParamMap.get('redirectURL')) {  
                        
                        if (redirectURL.includes(storeFrontDomain)) {
                            // Navigate to the external redirect url
                            this._document.location.href = redirectURL;
                        } else {
                            // Navigate to the internal redirect url
                            this._router.navigateByUrl(redirectURL);
                        }
                    }
                    else 
                    {
                        this._router.navigateByUrl('/signed-in-redirect');
                    }

                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
