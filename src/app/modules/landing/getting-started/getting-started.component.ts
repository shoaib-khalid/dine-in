import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { Subject, takeUntil, combineLatest, mergeMap, take, map, switchMap, lastValueFrom } from 'rxjs';
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
import { UserService } from 'app/core/user/user.service';
import { TimeComponents } from 'app/layout/common/_countdown/countdown.types';
import { CountdownService } from 'app/layout/common/_countdown/countdown.service';
import { LoadingScreenService } from 'app/shared/loading-screen/loading-screen.service';
import { OrderService } from 'app/core/_order/order.service';
import { VoucherModalComponent } from 'app/modules/customer/vouchers/voucher-modal/voucher-modal.component';
import { DOCUMENT } from '@angular/common';
import { AppConfig } from 'app/config/service.config';

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
    tagType     : string = null;

    serviceType: 'tableService' | 'selfPickup';
    isLoading: boolean = false;
    currentScreenSize: string[] = [];
    tableNumber: any;
    dialogRef: any;
    token: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformsService: PlatformService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _currentLocationService: CurrentLocationService,
        private _dialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _locationService: LocationService,
        private _titleService: Title,
        private _diningService: DiningService,
        private _userService: UserService,
        private _countdownService: CountdownService,
        private _loadingScreenService: LoadingScreenService,
        private _orderService: OrderService

    )
    {
        this._loadingScreenService.show()
    }

    ngOnInit(): void {

        this.storeTag = this._activatedRoute.snapshot.paramMap.get('store-tag');
        
        this._locationService.tags$
            .pipe(
                takeUntil(this._unsubscribeAll),
                mergeMap((tagsResponse: Tag[]) => {
                    return this._countdownService.countdownTimer$.pipe(
                            take(1),
                            map((timeResponse: TimeComponents) => {
                                return { tags: tagsResponse, time: timeResponse }
                            })
                        )
                })
            )
            .subscribe((combinedResponse: { tags: Tag[], time: TimeComponents }) => {
                
                // Hide loading screen
                this._loadingScreenService.hide();

                if (combinedResponse.tags && combinedResponse.tags.length) {

                    let index = combinedResponse.tags[0].tagConfig.findIndex(item => item.property === "type");
                    if (index > -1) {
                        this.tagType = combinedResponse.tags[0].tagConfig[index].content;

                        // Update expiry time
                        if (this.tagType === "restaurant" && combinedResponse.time.timeDifference > 0) {
                            if (this._userService.userSessionId$){
                                this._userService.updateSession({sessionId: this._userService.userSessionId$, tagKeyword: this.storeTag}).subscribe()
                            }
                        }
                    }

                    // Check param after we know that store tag exists
                    this._activatedRoute.queryParams
                    .subscribe( params => {
                        let sessionTableNo = this._diningService.tableNumber$;
                        
                        if (params['tableno']) this.tableNumber = params['tableno'];

                        else if (sessionTableNo) this.tableNumber = sessionTableNo;

                        else this.tableNumber = undefined;

                        this.token = params['token'] ? params['token'] : null;

                        this._orderService.validateQRCode(this.token)
                        .subscribe({
                            next: resp => {

                                if (resp.tokenValid === true) this._orderService.token = this.token;
                                
                                if (resp === 'noToken' || resp.tokenValid === true) {
                                    if (this.tableNumber === undefined && this.tagType !== "restaurant" && combinedResponse.time.timeDifference > 0) {
                                        setTimeout(() => {
                                            this.openDialog('dining');
                                            // Mark for check
                                            this._changeDetectorRef.markForCheck();
                                        }, 200);
                                    } else if (this.tableNumber !== undefined || this.tagType === "restaurant") {
                                        if (this.tableNumber !== undefined) this._diningService.tableNumber = this.tableNumber + "";
                                        
                                        this._diningService.storeTag = this.storeTag;
                        
                                        if (this.tagType && this.tagType === "restaurant") {                                
                                            this._router.navigate(['/store/' + this.storeTag +'/all-products']);
                                        } else {
                                            this._router.navigate(['/restaurant/restaurant-list'], {queryParams: { storeTag: this.storeTag }});
                                        }
                                    } 
                                }
                            },
                            error: () => {
                                // Check if dialog is already open
                                if (this._dialog.openDialogs.length === 0 && !this.dialogRef) {

                                    this.dialogRef = this._dialog.open( 
                                        VoucherModalComponent, {
                                            data:{ 
                                                icon: 'feather:alert-circle',
                                                title: 'Invalid Token',
                                                description: 'Please rescan the QR Code',
                                            },
                                            hasBackdrop: true,
                                            disableClose: true
                                        });

                                    this.dialogRef.afterClosed()
                                        .subscribe(() => {

                                            sessionStorage.clear();
                                            this._document.location.href = 'https://' + AppConfig.settings.marketplaceDomain;

                                            // Mark for check
                                            this._changeDetectorRef.markForCheck();
                                        });
                                }
                            }
                        })
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

        this._loadingScreenService.hide();
    }


    openDialog(type: string)
    {
        if (!this.dialogRef) {
            this.dialogRef = this._dialog.open( 
                ServiceTypeDialog, {
                    data: {
                        servingType : type,
                        serviceType : this.serviceType,
                        storeTag    : this.storeTag
                    },
                    disableClose: true
                },
            );    
            this.dialogRef.afterClosed().subscribe(result=>{                
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
    
}
