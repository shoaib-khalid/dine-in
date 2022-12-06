import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil, distinctUntilChanged, finalize } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Platform } from 'app/core/platform/platform.types';
import { PlatformService } from 'app/core/platform/platform.service';
import { fuseAnimations } from '@fuse/animations';
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { FloatingBannerService } from 'app/core/floating-banner/floating-banner.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { AppConfig } from 'app/config/service.config';
import { DisplayErrorService } from 'app/core/display-error/display-error.service';
import { SearchService } from 'app/layout/common/_search/search.service';
import { DiningService } from 'app/core/_dining/dining.service';
import { TimeComponents } from 'app/layout/common/_countdown/countdown.types';
import { CountdownService } from 'app/layout/common/_countdown/countdown.service';
import { MatDialog } from '@angular/material/dialog';
import { VoucherModalComponent } from 'app/modules/customer/vouchers/voucher-modal/voucher-modal.component';
import { takeWhile } from 'lodash';
import { CartService } from 'app/core/cart/cart.service';
import { CheckoutService } from 'app/core/checkout/checkout.service';
import { LocationService } from 'app/core/location/location.service';
import { Tag } from 'app/core/location/location.types';

@Component({
    selector     : 'fnb02-layout',
    templateUrl  : './fnb02.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,

})
export class Fnb2LayoutComponent implements OnInit, OnDestroy
{
    platform: Platform;
    user: User;

    displayError: {
        type: string,
        title: string;
        message: string;
    } = null;
    
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    floatingMessageData = {};

    isHidden: boolean = false;
    isStorePage: boolean = false;
    isSearchOpened: boolean = false;
    floatingCartHidden: boolean = false;
    dialogRef: any;
    tagType: string;

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _apiServer: AppConfig,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _platformsService: PlatformService,
        private _displayErrorService: DisplayErrorService,
        private _userService: UserService,
        private _searchService: SearchService,
        private _diningService: DiningService,
        private _countdownService: CountdownService,
        public _dialog: MatDialog,
        private _cartService: CartService,
        private _checkoutService: CheckoutService,
        private _locationService: LocationService,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // set route and storeDetails to null first
        this._searchService.route = '';
        this._searchService.storeDetails = null;
        
        // if inside store page
        if (this._router.url.split('/').length > 1 && this._router.url.split('/')[1] === 'store'){
            this.isStorePage = true;
        }
        
        if (this._router.url && this._router.url === '/') {
            this.isSearchOpened = true;
        } 
        
        if (( this._router.url.split('/').length > 1 && (this._router.url.split('/')[1] === 'carts' || this._router.url.split('/')[1] === 'checkout' || this._router.url.split('/')[1] === 'order-history' || this._router.url.split('/')[1] === 'getting-started') ) || (this._router.url === '/')){		
            this.floatingCartHidden = true;		
        }

        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            distinctUntilChanged(),
            takeUntil(this._unsubscribeAll)
        ).subscribe((response: NavigationEnd) => {            

            let route = response.url.split('/');
            
            // If inside store page, set route to 'store'
            if (response.url === '/') {
                this.isSearchOpened = true
            } else {
                this.isSearchOpened = false
            }

            // if in store page 
            if (route[1] === 'store') {
                this._searchService.route = 'store';
                this.isStorePage = true;
            } 
            // if in restaurant list page
            else if (route[1] === 'restaurant') {
                this._searchService.route = 'restaurant-list';
            }
            else {
                // else set route and storeDetails to null
                this._searchService.route = '';
                this._searchService.storeDetails = null;
                this.isStorePage = false;
            }

            if ((route[1] === 'carts' || route[1] === 'checkout'|| route[1] === 'order-history' || route[1] === 'getting-started') || response.url === '/') {		
                this.floatingCartHidden = true;		
            } 
            else {		
                this.floatingCartHidden = false;		
            }
            
            // Mark for check
            this._changeDetectorRef.markForCheck();
            
        });

        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        // Subscribe to platform data
        this._platformsService.platform$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((platform: Platform) => {
                if (platform) {
                    this.platform = platform;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                if(user) {
                    this.user = user;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Subscribe to show error
        this._displayErrorService.errorMessage$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if (response) {
                    this.displayError = response;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Timer
        this._countdownService.countdownTimer$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((time: TimeComponents) => {
                
                if (time.timeDifference <= 0) {
                    
                    // Check if dialog is already open
                    if (!this.dialogRef) {

                        this.dialogRef = this._dialog.open( 
                            VoucherModalComponent,{
                                data:{ 
                                    icon: 'timer_off',
                                    title: 'The session ended',
                                    description: 'Please re-scan the QR Code',
                                },
                                hasBackdrop: true,
                                disableClose: true
                            });

                        this.dialogRef.afterClosed()
                            // .pipe(finalize(() => this.dialogRef = undefined))
                            .subscribe(() => {
        
                                this._cartService.cartIds = '';
                                this._cartService.cartsHeaderWithDetails = [];
                                this._checkoutService.cartsWithDetails = [];
                                this._cartService.cartsWithDetails = [];
                                
                                // Clear sessionStorage
                                this._userService.userSessionId = '';
                                this._diningService.storeTag = '';
                                this._diningService.tableNumber = '';
                                
                                // Reload the app
                                // this._document.location.reload();
                                this._document.location.href = 'https://' + AppConfig.settings.marketplaceDomain;
                                
                                // this.dialogRef = undefined; // maybe it's unnecessary

                                // Mark for check
                                this._changeDetectorRef.markForCheck();
                            });
                    }
                }
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
     * Open the search
     * Used in 'bar'
     */
    toggleSearch(): void
    {
        this.isSearchOpened = !this.isSearchOpened;
    }

    closeSearch(): void
    {
        // Return if it's already closed
        if ( !this.isSearchOpened )
        {
            return;
        }

        // Close the search
        this.isSearchOpened = false;
    }

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    goToHome() {

        let storeTag = this._diningService.storeTag$

        if (this.tagType && this.tagType === "restaurant") {                    
            this._router.navigate(['/store/' + storeTag +'/all-products']);
        } else {

            // this._router.navigate(['/getting-started/' + storeTag]);
            this._router.navigate(['/restaurant/restaurant-list'], {queryParams: { storeTag: storeTag }});

        }
        
        // Navigate to the internal redirect url (temporary)
        // const redirectURL = this.platform.name === "DeliverIn" ? "https://www.deliverin.my" : "https://www.easydukan.co";
        // this._document.location.href = redirectURL;
    }
    
}
