import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { CartService } from 'app/core/cart/cart.service';
import { Cart } from 'app/core/cart/cart.types';
import { JwtService } from 'app/core/jwt/jwt.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { StoresService } from 'app/core/store/store.service';
import { Store, StoreAssets } from 'app/core/store/store.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'landing-thankyou',
    templateUrl  : './thankyou.component.html',
    encapsulation: ViewEncapsulation.None,
    styles       : [``]
})
export class LandingThankyouComponent
{

    platform        : Platform;
    storeId         : string;
    store           : Store;
    cartId          : string;

    paymentType     : string;
    completionStatus: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private _storesService: StoresService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformService: PlatformService,
        private _activatedRoute: ActivatedRoute,
        private _jwtService: JwtService,
        private _authService: AuthService,
        private _cartService: CartService
    )
    {
    }

    ngOnInit() {

        // let currentCartId = this._cartService.cartId$
        let customerId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid ? this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid : null

        // this.storeId = this._activatedRoute.snapshot.paramMap.get('store-id');
        this.paymentType = this._activatedRoute.snapshot.paramMap.get('payment-type');
        this.completionStatus = this._activatedRoute.snapshot.paramMap.get('completion-status');

        // this._storesService.getStoreById(this.storeId);

        // const createCartBody = {
        //     customerId: customerId, 
        //     storeId: this._storesService.storeId$,
        // }
        
        if(this.completionStatus === "Payment_was_successful" || this.completionStatus === "ORDER_CONFIRMED") {
            // this._cartService.deleteCartbyId(currentCartId).subscribe((response) => {
            // });
            
            // this._cartService.createCart(createCartBody)
            // .subscribe((cart: Cart)=>{
            //     // set cart id
            //     this.cartId = cart.id;

            //     if(this.cartId && this.cartId !== '') {
            //         this.getCartItems(this.cartId);
            //     }
            // });
        }
        // Get the store info
        // this._storesService.store$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((response: Store) => {
        //         if (response) {
        //             this.store = response;
        //         }
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        this._platformService.platform$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((platform: Platform)=>{
                if (platform) {
                    this.platform = platform;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    // getCartItems(cartId: string){
    //     if (cartId) {
    //         this._cartService.getCartItems(cartId)
    //         .subscribe((response)=>{
    //         });
    //     }
    // }

    displayStoreLogo(storeAssets: StoreAssets[]) {
        let storeAssetsIndex = storeAssets ? storeAssets.findIndex(item => item.assetType === 'LogoUrl') : -1;
        if (storeAssetsIndex > -1) {
            return storeAssets[storeAssetsIndex].assetUrl;
        } else {
            return this.platform.logo;
        }
    }
}
