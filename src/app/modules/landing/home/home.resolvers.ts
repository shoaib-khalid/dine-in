import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { PlatformService } from 'app/core/platform/platform.service';
import { JwtService } from 'app/core/jwt/jwt.service';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpStatService } from 'app/mock-api/httpstat/httpstat.service';
import { AdsService } from 'app/core/ads/ads.service';
import { LocationService } from 'app/core/location/location.service';
import { Platform } from 'app/core/platform/platform.types';

@Injectable({
    providedIn: 'root'
})
export class HomeResolver implements Resolve<any>
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    /**
     * Constructor
     */
    constructor(
        private _adsService: AdsService,
        private _jwtService: JwtService,
        private _authService: AuthService,
        private _platformsService: PlatformService,
        private _locationService: LocationService,
        private _httpstatService: HttpStatService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {        
        // Fork join multiple API endpoint calls to wait all of them to finish
        return of(true)
                .pipe(
                    take(1),
                    map((response: boolean) => {                            
                        this._platformsService.platform$
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((platform: Platform) => {
                                if (platform) {
                                    // this._locationService.getFeaturedLocations({ pageSize: 10, regionCountryId: platform.country}).subscribe(()=>{});
                                    // this._locationService.getFeaturedStores({ pageSize: 10, regionCountryId: platform.country}).subscribe(()=>{});
                                    // this._locationService.getFeaturedProducts({ pageSize: 10, regionCountryId: platform.country}).subscribe(()=>{});
                                    
                                    // this._locationService.getParentCategories({ pageSize: 8, regionCountryId: platform.country}).subscribe(()=>{});
                                    // this._locationService.getStoresDetails({ pageSize: 5, regionCountryId: platform.country}).subscribe(()=>{});
                                    // this._locationService.getProductsDetails({ pageSize: 5, regionCountryId: platform.country}).subscribe(()=>{});
                                }
                            })
                    })
                )
    }
}