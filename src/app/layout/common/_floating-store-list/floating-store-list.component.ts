import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config';
import { AppConfig } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';
import { LocationService } from 'app/core/location/location.service';
import { StoreAssets, StoresDetails } from 'app/core/location/location.types';
import { DiningService } from 'app/core/_dining/dining.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector     : 'floating-store-list',
    templateUrl  : './floating-store-list.component.html',
    styles       : [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class FloatingStoreListComponent implements OnInit, OnDestroy
{
    storeTag: string = "";
    platform: Platform;
    config: AppConfig;
    stores: StoresDetails[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _platformService: PlatformService,
        private _locationService: LocationService,
        private _diningService: DiningService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfigService: FuseConfigService
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
        this.storeTag = this._diningService.storeTag$;

        if (this.storeTag && this.storeTag !== ""){
            this._platformService.platform$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((platform: Platform) => {
                    if (platform) {
                        this.platform = platform;

                        this._locationService.getStoresDetails({
                            page            : 0, 
                            pageSize        : 99, 
                            tagKeyword      : this.storeTag, 
                            regionCountryId : this.platform.country,
                            isDineIn        : true
                        }).subscribe();
                    }
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        }

        // Get List of stores
        this._locationService.storesDetails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((stores: StoresDetails[]) => {
                this.stores = stores;                
            });
        
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {
                // Store the config
                this.config = config;
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
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    reload(){
        this._router.routeReuseStrategy.shouldReuseRoute = () => false;
        this._router.onSameUrlNavigation = 'reload';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    displayStoreLogo(storeAssets: StoreAssets[]) {
        let storeAssetsIndex = storeAssets.findIndex(item => item.assetType === 'LogoUrl');
        if (storeAssetsIndex > -1) {
            return storeAssets[storeAssetsIndex].assetUrl;
        } else {
            return this.platform.logoSquare;
        }
    }

    goToStore(url: string)
    {
        let storeDomain = url.split(".")[0];
        this._router.navigate(['/store/' + storeDomain + '/all-products']);

        this.reload();
    }
}
