import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CurrentLocationService } from 'app/core/_current-location/current-location.service';
import { CurrentLocation } from 'app/core/_current-location/current-location.types';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ServiceTypeDialog } from './service-type-dialog/service-type-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DiningService } from 'app/core/_dining/dining.service';
import { LocationService } from 'app/core/location/location.service';
import { Tag } from 'app/core/location/location.types';

@Component({
    selector     : 'landing-getting-started',
    templateUrl  : './getting-started.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingGettingStartedComponent implements OnInit
{

    platform: Platform;
    currentLocation: CurrentLocation;
    storeTag    : string;
    tagType     : string;

    serviceType: 'tableService' | 'selfPickup';
    isLoading: boolean = false;
    currentScreenSize: string[] = [];
    tableNumber: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformsService: PlatformService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _currentLocationService: CurrentLocationService,
        private _dialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _locationService: LocationService,
        private _titleService: Title,
        private _diningService: DiningService
    )
    {
    }

    ngOnInit(): void {

        this.storeTag = this._activatedRoute.snapshot.paramMap.get('store-tag');

        this._locationService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: Tag[]) => {
                if (response && response.length) {
                    let index = response[0].tagConfig.findIndex(item => item.property === "type");
                    if (index > -1) {
                        this.tagType = response[0].tagConfig[index].content;
                    }

                    // Check param after we know that store tag exists
                    this._activatedRoute.queryParams.subscribe(params => {
                        this.tableNumber = params['tableno'];
                        
                        if (this.tableNumber) {
                            this._diningService.tableNumber = this.tableNumber + "";
                            this._diningService.storeTag = this.storeTag;
            
            
                            if (this.tagType && this.tagType === "restaurant") {                                
                                this._router.navigate(['/store/' + this.storeTag +'/all-products']);
                            } else {
                                this._router.navigate(['/restaurant/restaurant-list'], {queryParams: { storeTag: this.storeTag }});
                            }
                            
                        }
                        else {
                            setTimeout(() => {
                                this.openDialog('dining');
                                // Mark for check
                                this._changeDetectorRef.markForCheck();
                            }, 200);
                        }
                    });
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        

        combineLatest([
            this._currentLocationService.currentLocation$,
            this._platformsService.platform$
        ]).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(([currentLocation, platform] : [CurrentLocation, Platform])=>{
            if (currentLocation && platform) {
                this.platform = platform;
                this.currentLocation = currentLocation;
            }
            // Mark for check
            this._changeDetectorRef.markForCheck();
        })

        // ----------------------
        // Fuse Media Watcher
        // ----------------------

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {               

                this.currentScreenSize = matchingAliases;                

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


    openDialog(type: string)
    {
        const dialogRef = this._dialog.open( 
            ServiceTypeDialog, {
                data: {
                    servingType : type,
                    serviceType : this.serviceType,
                    storeTag    : this.storeTag
                },
                disableClose: true
            },
        );    
        dialogRef.afterClosed().subscribe(result=>{                
            if (result) {
                if (this.tagType && this.tagType === "restaurant") {                    
                    this._router.navigate(['/store/' + this.storeTag +'/all-products']);
                } else {
                    this._router.navigate(['/restaurant/restaurant-list'], {queryParams: { storeTag: this.storeTag }});
                }
            }
        });
    }
    
}
