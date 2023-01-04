import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Banner } from 'app/core/ads/ads.types';
import { LocationService } from 'app/core/location/location.service';
import { FamousItem, FamousItemPagination, ProductDetailPagination, ProductDetails, StoresDetailPagination, StoresDetails, Tag } from 'app/core/location/location.types';
import { NavigateService } from 'app/core/navigate-url/navigate.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { ProductsService } from 'app/core/product/product.service';
import { AddOnProduct, Product } from 'app/core/product/product.types';
import { StorePagination } from 'app/core/store/store.types';
import { CurrentLocationService } from 'app/core/_current-location/current-location.service';
import { CurrentLocation } from 'app/core/_current-location/current-location.types';
import { OrderService } from 'app/core/_order/order.service';
import { SearchService } from 'app/layout/common/_search/search.service';
import { Subject, takeUntil, map, merge, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { _BottomSheetComponent } from '../../stores/_bottom-sheet-product/bottom-sheet.component';

@Component({
    selector     : 'landing-restaurants',
    templateUrl  : './restaurant-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingRestaurantsComponent implements OnInit
{
    @ViewChild("storesPaginator", {read: MatPaginator}) private _paginator: MatPaginator;
    @ViewChild("productsDetailsPaginator", {read: MatPaginator}) private _productsDetailsPaginator: MatPaginator;
    @ViewChild("famousItemPaginator", {read: MatPaginator}) private _famousItemPaginatorPaginator: MatPaginator;
    
    platform: Platform;
    currentLocation: CurrentLocation;
    
    // Stores Details
    storesDetailsTitle: string;
    storesDetails: StoresDetails[] = [];
    storesDetailsPagination: StorePagination;
    storesDetailsPageOfItems: Array<any>;
    storesDetailsPageSize: number = 30;
    oldStoresDetailsPaginationIndex: number = 0;

    // product detauls
    productsDetailsTitle: string = "Foods";
    productsDetails: ProductDetails[] = [];
    productsDetailsPagination: ProductDetailPagination;
    productsDetailsPageOfItems: Array<any>;
    productsDetailsPageSize: number = 20;
    oldProductsDetailsPaginationIndex: number = 0;

    famousItemTitle: string = "Best Selling Food & Beverages";
    famousItem: FamousItem[] = [];
    famousItemPagination: FamousItemPagination;
    famousItemPageOfItems: Array<any>;
    famousItemPageSize: number = 20;
    oldFamousItemPaginationIndex: number = 0;
    
    categoryId  : string;
    storeTag    : string;
        
    currentScreenSize: string[] = [];
    isLoading: boolean = false;
    searchName: string;
    bestSelling: string;

    tags        : Tag[];
    tagTitle    : string;
    tagType     : string;
    tagBanner   : string[] = [];

    galleryImages: Banner[] = [];
    mobileGalleryImages: Banner[] = [];

    displayProduct: boolean = false;
    displayStore: boolean = true;
    displayFamous: boolean = false;

    selectedProduct: Product = null;
    combos: any = [];
    addOns: AddOnProduct[] = [];

    displayFloating: 'none' | 'single' | 'multiple' = 'none';

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
        private _bottomSheet: MatBottomSheet,
        private _navigate: NavigateService,
        private _searchService: SearchService,
        private _productsService: ProductsService,
        private _orderService: OrderService
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
                    this.displayFloating = this.storesDetails && this.storesDetails.length > 1 ? 'multiple' : 'none';

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

        // Get Products Details
        this._locationService.productsDetails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((products : ProductDetails[]) => {                
                this.productsDetails = products;
                                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the product Details pagination
        this._locationService.productDetailPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: ProductDetailPagination) => {
                // Update the pagination
                this.productsDetailsPagination = pagination;                   
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Famous Items
        this._locationService.famousItem$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((famousItem : FamousItem[]) => {                
                this.famousItem = famousItem;
                                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
            
        // Get Famous Items pagination
        this._locationService.famousItemPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination : FamousItemPagination) => {                
                this.famousItemPagination = pagination;
                                
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

                        if (this.galleryImages.length > 0 && this.mobileGalleryImages.length > 0) {
                            // Do nothing still backend response both "banner" & "bannerMobile"
                        } else if (this.galleryImages.length > 0 && this.mobileGalleryImages.length === 0) {
                            this.mobileGalleryImages = this.galleryImages;
                        } else if (this.galleryImages.length === 0 && this.mobileGalleryImages.length > 0) {
                            this.galleryImages = this.mobileGalleryImages;
                        } else {
                            // Do nothing since there are no image at all
                        }
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
                        this.bestSelling = params.bestSelling ? params.bestSelling : null;
                        
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

                            // Get products
                            this._locationService.getProductsDetails({ 
                                name            : this.searchName, 
                                page            : this.oldProductsDetailsPaginationIndex,
                                pageSize        : this.productsDetailsPageSize,
                                status          : ['ACTIVE, OUTOFSTOCK'],
                                regionCountryId : this.platform.country, 
                                parentCategoryId: this.categoryId, 
                                storeTagKeyword : this.storeTag,
                                latitude        : currentLat,
                                longitude       : currentLong,
                                isDineIn        : true
                            })
                            .subscribe((response)=>{});
                        } else {

                        }

                        if(this.searchName && this.searchName !== '') {                               
                            this.displayProduct = true;
                            this.displayStore = false;
                            this.displayFamous = false;
                        } 
                        else if (!this.searchName)
                        {
                            this.displayProduct = false;
                            this.displayStore = true;
                            this.displayFamous = false;
                        }

                        if(this.bestSelling === 'true') {

                            this._locationService.getFamousItems(this.storeTag).subscribe((response) => {});

                            this.displayFamous = true;
                            this.displayStore = false;
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

        this._productsService.selectedProduct$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((product: Product) => {
                if (product) {
                    
                    this.selectedProduct = product;
                    this.preLoadProduct(product)

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
                
            });
    }

    /**
    * After view init
    */
    ngAfterViewInit(): void
    {
        setTimeout(() => {
            // handle if user allow location
            let currentLat = this.currentLocation.isAllowed ? this.currentLocation.location.lat : null;
            let currentLong = this.currentLocation.isAllowed ? this.currentLocation.location.lng : null;

            if (this._paginator)
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();

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
            if (this._productsDetailsPaginator )
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();

                // Get products if sort or page changes
                merge(this._productsDetailsPaginator.page).pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._locationService.getProductsDetails({ 
                            name            : this.searchName, 
                            page            : this.productsDetailsPageOfItems['currentPage'] - 1, 
                            pageSize        : this.productsDetailsPageOfItems['pageSize'],
                            status          : ['ACTIVE, OUTOFSTOCK'],
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
            if (this._famousItemPaginatorPaginator)
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();

                // Get products if sort or page changes
                merge(this._famousItemPaginatorPaginator.page).pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._locationService.getProductsDetails({ 
                            name            : this.searchName, 
                            page            : this.productsDetailsPageOfItems['currentPage'] - 1, 
                            pageSize        : this.productsDetailsPageOfItems['pageSize'],
                            status          : ['ACTIVE, OUTOFSTOCK'],
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
        this._productsService.selectProduct(null);

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public Function
    // -----------------------------------------------------------------------------------------------------

    onChangePage(pageOfItems: Array<any>) {
        // update current page of items
        this.storesDetailsPageOfItems = pageOfItems;
        // handle if user allow location
        let currentLat = this.currentLocation.isAllowed ? this.currentLocation.location.lat : null;
        let currentLong = this.currentLocation.isAllowed ? this.currentLocation.location.lng : null;

        if(this.storesDetailsPagination && this.storesDetailsPageOfItems['currentPage']) {
            if (this.storesDetailsPageOfItems['currentPage'] - 1 !== this.storesDetailsPagination.page) {
                // set loading to true
                this.isLoading = true;


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

        // update current page of items
        this.productsDetailsPageOfItems = pageOfItems;
        if( this.productsDetailsPagination && this.productsDetailsPageOfItems['currentPage']) {
            if (this.productsDetailsPageOfItems['currentPage'] - 1 !== this.productsDetailsPagination.page) {
                // set loading to true
                this.isLoading = true;
    
                this._locationService.getProductsDetails({ 
                        storeName       : this.searchName, 
                        page            : this.productsDetailsPageOfItems['currentPage'] - 1, 
                        pageSize        : this.productsDetailsPageOfItems['pageSize'], 
                        status          : ['ACTIVE, OUTOFSTOCK'],
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

    preLoadProduct(product: Product){
        
        // Precheck for combo
        if (product.isPackage) {
            this.combos = null;
            
            // get product package if exists
            this._productsService.getProductPackageOptions(product.storeId, product.id)
                .subscribe((response)=>{
                    if (response.length > 0) {
                        this.combos = response;
                        this.openDrawer();
                    }

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        }
        else if (product.hasAddOn === true) {

            this._productsService.getAddOnItemsOnProduct({productId: product.id})
                .subscribe((addOnsResp: AddOnProduct[]) => {
                    if (addOnsResp.length > 0) {
                        this.addOns = addOnsResp;
                        this.openDrawer();
                    }
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                })
        }
        // Normal/variant product
        else {
            this.openDrawer();
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
        
    }

    openDrawer(){
        setTimeout(() => {
            let bottomSheet = this._bottomSheet.open(_BottomSheetComponent, { 
                data: {
                    product: this.selectedProduct,
                    combos : this.combos,
                    addOns : this.addOns 
                }
            });
            bottomSheet.afterDismissed()
            .subscribe(() => 
                {
                    this._productsService.selectProduct(null);
                }
            )
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 0);
        
    }

    scrollToTop(){        
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
        });
    }
}
