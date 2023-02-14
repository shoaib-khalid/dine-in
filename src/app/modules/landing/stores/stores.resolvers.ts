import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { tap, Observable, switchMap, map, take, of, forkJoin} from 'rxjs';
import { StoresService } from 'app/core/store/store.service';
import { ProductsService } from 'app/core/product/product.service';
import { AppConfig } from 'app/config/service.config';
import { Store, StoreCategory } from 'app/core/store/store.types';
import { DisplayErrorService } from 'app/core/display-error/display-error.service';
import { LocationService } from 'app/core/location/location.service';

@Injectable({
    providedIn: 'root'
})
export class StoresResolver implements Resolve<any>
{
    storeDomain: string;
    /**
     * Constructor
     */
    constructor(
        private _apiServer: AppConfig,
        private _storesService: StoresService,
        private _productsService: ProductsService,
        private _displayErrorService: DisplayErrorService,
        private _locationService: LocationService

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
    * Resolver
    *
    * @param route
    * @param state
    */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let storeFrontUrl = this._apiServer.settings.storeFrontDomain;
        let storeDomain = route.paramMap.get('store-slug');  

        return this._storesService.getStoreByDomainName(storeDomain + storeFrontUrl)
            .pipe(
                tap((store: Store) => {                        
                    if (!store) {
                        this._displayErrorService.show({title: "Store Not Found", type: '4xx', message: "The store you are looking for might have been removed, had its name changed or is temporarily unavailable.", code: "404"});

                    } 
                }),
                switchMap((store: Store) => {
                    return forkJoin(
                        [
                            this._locationService.getFamousProduct(store ? store.id : null),
                            this._storesService.getStoreCategories(store ? store.id : null),
                            this._productsService.getProducts(store ? store.id : null)
                        ])
                })
            );
    }
}
