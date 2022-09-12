import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { JwtService } from 'app/core/jwt/jwt.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { Subject, takeUntil } from 'rxjs';
import { Platform } from 'app/core/platform/platform.types';
import { AuthService } from 'app/core/auth/auth.service';
import { ValidateOauthRequest } from 'app/core/auth/auth.types';
import { AppConfig } from 'app/config/service.config';
import { AppleLoginService } from './apple-login.service';
import { CartService } from 'app/core/cart/cart.service';
import { Cart, CartItem } from 'app/core/cart/cart.types';



@Component({
    selector     : 'apple-login',
    template  : ``,
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AppleLoginComponent
{
    idToken:string;
    jwtData:string;
    clientEmail:string;

    platform: Platform;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    domain :string ='';
    cart: Cart;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _jwtService: JwtService,
        private _authService: AuthService,
        private _platformsService: PlatformService,
        private _apiServer: AppConfig,
        private _appleLoginService: AppleLoginService,
        private _cartsService: CartService,

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
        this._activatedRoute.queryParams.subscribe(params => {
            this.idToken = params['id_token'];
            this.jwtData = this._jwtService.getJwtPayload(this.idToken);
            this.clientEmail = this.jwtData['email'];

            this.domain = this._apiServer.settings.storeFrontDomain;

            this._platformsService.platform$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((platform: Platform) => {

                    this.platform = platform;    

                    if (this.platform) {

                        let validateOauthRequest: ValidateOauthRequest = new ValidateOauthRequest();
                        validateOauthRequest.country = this.platform.country;
                        validateOauthRequest.loginType = "APPLE";
                        validateOauthRequest.token = this.idToken;
                        validateOauthRequest.email = this.clientEmail;
                        validateOauthRequest.domain = this.domain;
    
                        this._authService.loginOauth(validateOauthRequest, "Apple Login")
                            .subscribe((loginOauthResponse)=> {

                                const redirectURL = this._appleLoginService.sfUrl$ ? this._appleLoginService.sfUrl$ : null;
                                const guestCartId = this._appleLoginService.guestCartId$ ? this._appleLoginService.guestCartId$ : null;
                                const storeId = this._appleLoginService.storeId$ ? this._appleLoginService.storeId$ : null;

                                // merge multiple guests carts
                                let cartIds: { id: string, storeId: string, cartItems: CartItem[]}[] = this._cartsService.cartIds$ ? JSON.parse(this._cartsService.cartIds$) : [];
                                
                                if (cartIds.length > 0) {

                                    this._cartsService.mergeMultipleCarts(loginOauthResponse['session'].ownerId, cartIds.map(cart => cart.id))
                                    .subscribe(()=> {
                                        // Resolve cart after merge
                                        this._cartsService.cartResolver().subscribe();
                                        this._cartsService.cartResolver(true).subscribe();
                                    })

                                }

                                // Merge cart
                                if (guestCartId && storeId) {  
                                
                                    this._cartsService.mergeAndRedirect(guestCartId, storeId, loginOauthResponse['session'].ownerId, redirectURL);
                                
                                } 
                                // if no guestCartId/storeId
                                else {
                                    this._cartsService.redirect(redirectURL);
                                }
                                
                                // remove from localStorage
                                localStorage.removeItem('sf-url');
                                localStorage.removeItem('guestCartId');
                                localStorage.removeItem('storeId');

                            });
                    }

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
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
}
