import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Banner } from 'app/core/ads/ads.types';
import { LocationService } from 'app/core/location/location.service';
import { LandingLocation, LocationArea, StoresDetailPagination, StoresDetails, Tag } from 'app/core/location/location.types';
import { NavigateService } from 'app/core/navigate-url/navigate.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { StorePagination } from 'app/core/store/store.types';
import { CurrentLocationService } from 'app/core/_current-location/current-location.service';
import { CurrentLocation } from 'app/core/_current-location/current-location.types';
import { SearchService } from 'app/layout/common/_search/search.service';
import { Subject, takeUntil, map, merge, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector     : 'landing-restaurants',
    templateUrl  : './restaurant-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingRestaurantsComponent implements OnInit
{
    @ViewChild("storesPaginator", {read: MatPaginator}) private _paginator: MatPaginator;
    
    platform: Platform;
    currentLocation: CurrentLocation;
    
    // Stores Details
    storesDetailsTitle: string;
    storesDetails: StoresDetails[] = [];
    storesDetailsPagination: StorePagination;
    storesDetailsPageOfItems: Array<any>;
    storesDetailsPageSize: number = 30;
    oldStoresDetailsPaginationIndex: number = 0;
    
    categoryId  : string;
    storeTag    : string;
        
    currentScreenSize: string[] = [];
    isLoading: boolean = false;
    searchName: string;

    tags        : Tag[];
    tagTitle    : string;
    tagType     : string;
    tagBanner   : string[] = [];

    galleryImages: Banner[] = [];
    mobileGalleryImages: Banner[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformsService: PlatformService,
        private _currentLocationService: CurrentLocationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _locationService: LocationService,
        private _activatedRoute: ActivatedRoute,
        private _navigate: NavigateService,
        private _searchService: SearchService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        // Set route to 'restaurant-list' on init		
        this._searchService.route = 'restaurant-list'

        this._locationService.storesDetails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((stores: StoresDetails[]) => { 
                if (stores) {
                    this.storesDetails = stores;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the store pagination
        this._locationService.storesDetailPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: StoresDetailPagination) => {
                // Update the pagination
                this.storesDetailsPagination = pagination;                   
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get tags
        this._locationService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: Tag[]) => {
                if (response && response.length) {
                    this.tags = response;

                    // Tag Title
                    let titleIndex = this.tags[0].tagConfig.findIndex(item => item.property === 'title');
                    if (titleIndex > -1) {
                        this.tagTitle = this.tags[0].tagConfig[titleIndex].content;
                    }

                    // Tag Type
                    let typeIndex = this.tags[0].tagConfig.findIndex(item => item.property === 'type');
                    if (typeIndex > -1) {
                        this.tagType = this.tags[0].tagConfig[typeIndex].content;
                    }

                    // Tag Banner
                    let bannerIndex = this.tags[0].tagConfig.findIndex((item) => item.property === 'banner');
                    if (bannerIndex > -1) {
                        this.tagBanner = this.tags[0].tagConfig.map(item => {
                            return item.property === "banner" ? item.content : null;
                        }).filter(n => n);

                        this.galleryImages = this.tags[0].tagConfig.map((item, iteration) => {
                            return item.property === "banner" ? {
                                id: iteration + 1,
                                bannerUrl: item.content,
                                regionCountryId: '',
                                type: 'DESKTOP',
                                actionUrl: null,
                                sequence: iteration + 1,
                                delayDisplay: 10
                            } : null;
                        }).filter(n => n);

                        this.mobileGalleryImages = this.tags[0].tagConfig.map((item, iteration) => {
                            return item.property === "bannerMobile" ? {
                                id: iteration + 1,
                                bannerUrl: item.content,
                                regionCountryId: '',
                                type: 'MOBILE',
                                actionUrl: null,
                                sequence: iteration + 1,
                                delayDisplay: 10
                            } : null;
                        }).filter(n => n);
                    }                    

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

                    // Set title if location is on
                    if (currentLocation.isAllowed) {
                        this.storesDetailsTitle = 'Discover Shops Near Me';
                    }

                    let currentLat = currentLocation.isAllowed ? currentLocation.location.lat : null;
                    let currentLong = currentLocation.isAllowed ? currentLocation.location.lng : null;

                    // Get searches from url parameter 
                    this._activatedRoute.queryParams.subscribe(params => {
                        this.categoryId = params.categoryId ? params.categoryId : null;
                        this.storeTag = params.storeTag ? params.storeTag : null;
                        this.searchName = params.keyword ? params.keyword : null;
                        
                        if (this.storeTag) {
                        
                            // if there are value for categoryId OR locationId
                            // no need for lat long, since customer want to see stores that contain the query
                            // if (this.categoryId || this.locationId) {
                            //     currentLat = null;
                            //     currentLong = null;
                            // }

                            // get back the previous pagination page
                            // more than 2 means it won't get back the previous pagination page when navigate back from 'carts' page
                            if (this._navigate.getPreviousUrl() && this._navigate.getPreviousUrl().split("/").length > 2) {                            
                                this.oldStoresDetailsPaginationIndex = this.storesDetailsPagination ? this.storesDetailsPagination.page : 0;
                            }
                            
                            // Get stores
                            this._locationService.getStoresDetails({
                                storeName       : this.searchName,
                                page            : this.oldStoresDetailsPaginationIndex,
                                pageSize        : this.storesDetailsPageSize, 
                                regionCountryId : this.platform.country, 
                                parentCategoryId: this.categoryId, 
                                tagKeyword      : this.storeTag,
                                latitude        : currentLat,
                                longitude       : currentLong,
                                isDineIn        : true
                            })
                            .subscribe((stores : StoresDetails[]) => {});
                        } else {

                        }
                    });
                }
                this._changeDetectorRef.markForCheck();
            });

        // collapse category to false if desktop by default, 
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                this.currentScreenSize = matchingAliases;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
    * After view init
    */
    ngAfterViewInit(): void
    {
        setTimeout(() => {
            if (this._paginator)
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();

                // handle if user allow location
                let currentLat = this.currentLocation.isAllowed ? this.currentLocation.location.lat : null;
                let currentLong = this.currentLocation.isAllowed ? this.currentLocation.location.lng : null;

                // if there are value for categoryId OR locationId
                // no need for lat long, since customer want to see stores that contain the query
                // if (this.categoryId || this.locationId) {
                //     currentLat = null;
                //     currentLong = null;
                // }

                // Get products if sort or page changes
                merge(this._paginator.page).pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._locationService.getStoresDetails({
                            storeName       : this.searchName,
                            page            : this.storesDetailsPageOfItems['currentPage'] - 1, 
                            pageSize        : this.storesDetailsPageOfItems['pageSize'], 
                            regionCountryId : this.platform.country, 
                            parentCategoryId: this.categoryId, 
                            // cityId          : this.adjacentLocationIds,
                            latitude        : currentLat,
                            longitude       : currentLong,
                            isDineIn        : true
                        });
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                ).subscribe();
            }
        }, 0);
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
    // @ Public Function
    // -----------------------------------------------------------------------------------------------------

    onChangePage(pageOfItems: Array<any>) {
        // update current page of items
        this.storesDetailsPageOfItems = pageOfItems;

        if(this.storesDetailsPagination && this.storesDetailsPageOfItems['currentPage']) {
            if (this.storesDetailsPageOfItems['currentPage'] - 1 !== this.storesDetailsPagination.page) {
                // set loading to true
                this.isLoading = true;

                // handle if user allow location
                let currentLat = this.currentLocation.isAllowed ? this.currentLocation.location.lat : null;
                let currentLong = this.currentLocation.isAllowed ? this.currentLocation.location.lng : null;

                // if there are value for categoryId OR locationId
                // no need for lat long, since customer want to see stores that contain the query
                // if (this.categoryId || this.locationId) {
                //     currentLat = null;
                //     currentLong = null;
                // }
    
                this._locationService.getStoresDetails({
                    storeName       : this.searchName,
                    page            : this.storesDetailsPageOfItems['currentPage'] - 1, 
                    pageSize        : this.storesDetailsPageOfItems['pageSize'], 
                    regionCountryId : this.platform.country, 
                    parentCategoryId: this.categoryId, 
                    // cityId          : this.adjacentLocationIds,
                    latitude        : currentLat,
                    longitude       : currentLong,
                    isDineIn        : true
                })
                .subscribe(()=>{
                    // set loading to false
                    this.isLoading = false;
                });
            }
        }
        
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
    * 
    * This function will return display see more based on height of 
    * div container
    * 
    * @param storesDescription 
    * @returns 
    */
    displaySeeMore(storesDescription){

        var div = document.createElement("div")
        div.innerHTML = storesDescription
        div.style.width ="15rem";
        document.body.appendChild(div)

        if (div.offsetHeight > 20) {
            div.setAttribute("class","hidden")
            return true;
        } else {
            div.setAttribute("class","hidden")
            return false;
        }
    }

    scrollToTop(){        
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
        });
    }
}
