import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { DOCUMENT } from '@angular/common';
import { Store, StoreAssets } from 'app/core/store/store.types';
import { ProductDetails } from 'app/core/location/location.types';
import { StoresService } from 'app/core/store/store.service';
import { Product, StoresDetails } from 'app/core/product/product.types';
import { ProductsService } from 'app/core/product/product.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
    selector     : 'featured-products',
    templateUrl  : './featured-products.component.html',
    encapsulation: ViewEncapsulation.None
})
export class _FeaturedProductsComponent implements OnInit, OnDestroy
{

    platform: Platform;
    selectedProduct: Product;

    @Input() products: Product[] | ProductDetails[];
    @Input() title: string = "Product";
    @Input() showViewAll: boolean = false;
    @Input() redirectURL: { categoryId?: string, locationId?: string } = null;

    currentScreenSize: string[];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _platformService: PlatformService,
        private _router: Router,
        private _productsService: ProductsService,
        private _storesService: StoresService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._platformService.platform$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((platform: Platform)=>{
                this.platform = platform;
            });

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
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    chooseStore(storeDomain:string) {
        let slug = storeDomain.split(".")[0]
        this._router.navigate(['/store/' + slug]);
    }

    redirectToProduct(productDetails: ProductDetails) {

        const storeSlug = productDetails.storeDetails.domain.split(".")[0];

        combineLatest([
            this._productsService.getProductsById(productDetails.storeDetails.id, productDetails.id),
            this._storesService.getStoreById(productDetails.storeDetails.id)
        ])
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(([product, store] : [Product,Store]) =>{
            if (product && store) {

                this.selectedProduct = product;
                // set the valueofstore details
                this.selectedProduct.storeDetails = <any>store;

                // if has stock
                if (this.isProductHasStock(product)) {
                    if (this.currentScreenSize.includes('md'))
                        this._router.navigate(['store/' + storeSlug + '/all-products/' + product.seoNameMarketplace]);
                    else {
                        this._productsService.selectProduct(product);
                    }
                }
                else return
            }
        });
    }

    isProductHasStock(product: Product): boolean
    {   
        
        if (product.allowOutOfStockPurchases === true) {
            return true;
        } else {
            if (product.productInventories.length > 0) {
                let productInventoryQuantities = product.productInventories.map(item => item.quantity);
                let totalProductInventoryQuantity = productInventoryQuantities.reduce((partialSum, a) => partialSum + a, 0);
    
                if (totalProductInventoryQuantity > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    displayStoreLogo(storeAssets: StoreAssets[]) {
        let storeAssetsIndex = storeAssets.findIndex(item => item.assetType === 'LogoUrl');
        if (storeAssetsIndex > -1) {
            return storeAssets[storeAssetsIndex].assetUrl;
        } else {
            return this.platform.logoSquare;
        }
    }

    displayProductImage(product: any) {
        
    } 

    viewAll(){
        if (this.redirectURL) {
            this._router.navigate(['/product/product-list'], {queryParams: this.redirectURL});
        } else {
            this._router.navigate(['/product/product-list']);
        }
    }
}

