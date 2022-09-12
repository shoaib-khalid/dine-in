import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { Cart, CartItem } from 'app/core/cart/cart.types';
import { AuthService } from 'app/core/auth/auth.service';
import { CartService } from 'app/core/cart/cart.service';
import { DOCUMENT } from '@angular/common';
import { AppConfig } from 'app/config/service.config';
import { StoresService } from 'app/core/store/store.service';
import { FloatingBannerService } from 'app/core/floating-banner/floating-banner.service';

@Component({
    selector       : 'floating-message-small',
    templateUrl    : './floating-message-small.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'floating-message-small'
})
export class FloatingMessageSmallComponent implements OnInit, OnDestroy
{

    // @Input() url: string = null;
    // @Input() data: {};
    // @Input() image: string = null;
    cart: Cart;
    sanatiseUrl: string;
    cartItem: CartItem[];
    cartItemQuantity: number = 0;
    image: string;
    redirectUrl: string;


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _cartService: CartService,
        private _authService: AuthService,
        private _apiServer: AppConfig,
        private _floatingBannerService: FloatingBannerService,

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
        this._floatingBannerService.promoSmall$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(promoSmall => {
                if (promoSmall) {
                    this.image = promoSmall.bannerUrl;
                    this.redirectUrl = promoSmall.redirectUrl;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            })
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

    closeMessage() {
        this._floatingBannerService.closeSmallBanner();
        this.image = null;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    uponClicked() {
        // sign up
        this._document.location.href = this.redirectUrl;
    }
    
}
