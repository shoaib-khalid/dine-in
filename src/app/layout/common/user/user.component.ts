import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { CustomerAuthenticate } from 'app/core/auth/auth.types';
import { AuthService } from 'app/core/auth/auth.service';
import { PlatformLocation } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from 'app/config/service.config';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;

    customer:any;
    customerAuthenticate: CustomerAuthenticate;

    sanatiseUrl: string;

    countdown: number = 0;
    countdownMapping: any = {
        '=1'   : '# second',
        'other': '# seconds'
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformLocation: PlatformLocation,
        private _cookieService: CookieService,
        private _apiServer: AppConfig,
        private _router: Router,
        private _userService: UserService,
        private _authService: AuthService,
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

        let fullUrl = (this._platformLocation as any).location.origin;
        this.sanatiseUrl = fullUrl.replace(/^(https?:|)\/\//, '').split(':')[0]; // this will get the domain from the URL
        
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._authService.customerAuthenticate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: CustomerAuthenticate) => {

                if (this.customerAuthenticate) {
                    this.customerAuthenticate = response;

                    this._userService.get(this.customerAuthenticate.session.ownerId)
                        .subscribe((response)=>{
                            this.customer = response;
                        });
                }
                    
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }

    /**
     * Edit Profile
     */

    editProfile(): void
    {
        this._router.navigate(['/profile']);
    }

    /**
     * Edit Profile
     */

    ordersRedirect(): void
    {
        this._router.navigate(['/orders']);
    }

    vouchersRedirect(): void
    {
        this._router.navigate(['/vouchers']);
    }


    customerLogin(){
        // // Set cookie for testing
        // this._cookieService.set('CustomerId','bd421a78-fc36-4691-a5e5-38278e0a4245');
        // this._cookieService.set('AccessToken','W0JAMTI5ZTE3NDg=');
        // this._cookieService.set('RefreshToken','W0JANTQwOGY0ZmU=');

        // this._document.location.href = 'https://' + this._apiServer.settings.marketplaceDomain + '/sign-in' +
        //     '?redirectURL=' + encodeURI('https://' + this.sanatiseUrl + this._router.url);

        this._router.navigate(['sign-in']);
    }
    
    customerLogout(){

        // Sign out
        this._authService.signOut();

        // set user observable to null when logout 
        this._userService.user = null;


        // // for localhost testing
        // this._cookieService.delete('CustomerId');
        // this._cookieService.delete('RefreshToken');
        // this._cookieService.delete('AccessToken');

        this._cookieService.delete('CustomerId','/', this._apiServer.settings.storeFrontDomain);
        this._cookieService.delete('RefreshToken','/', this._apiServer.settings.storeFrontDomain);
        this._cookieService.delete('AccessToken','/', this._apiServer.settings.storeFrontDomain);

        // this._document.location.href = 'https://' + this._apiServer.settings.marketplaceDomain + '/sign-out' +
        //     '?redirectURL=' + encodeURI('https://' + this.sanatiseUrl);

        // Redirect after the countdown
        timer(0, 1000)
            .pipe(
                finalize(() => {
                    this._router.navigate(['sign-out']);
                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }

    customerRegister(){
        // this._document.location.href = 'https://' + this._apiServer.settings.marketplaceDomain + '/sign-up' +
        //     '?redirectURL=' + encodeURI('https://' + this.sanatiseUrl  + this._router.url);

        this._router.navigate(['sign-up']);
    }
}
