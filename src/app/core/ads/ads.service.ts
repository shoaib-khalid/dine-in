import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AppConfig } from 'app/config/service.config';
import { LogService } from 'app/core/logging/log.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Ad, Banner } from './ads.types';

@Injectable({
    providedIn: 'root'
})
export class AdsService
{
    private _ad: ReplaySubject<Ad> = new ReplaySubject<Ad>(1);
    private _ads: ReplaySubject<Ad[]> = new ReplaySubject<Ad[]>(1);

    private _banner: BehaviorSubject<Banner | null> = new BehaviorSubject(null);
    private _bannersDesktop: BehaviorSubject<Banner[] | null> = new BehaviorSubject(null);
    private _bannersMobile: BehaviorSubject<Banner[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiServer: AppConfig,
        private _authService: AuthService,
        private _router: Router,
        private _logging: LogService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for cart
     *
     * @param value
     */
    set ad(value: Ad)
    {
        // Store the value
        this._ad.next(value);
    }

    get ad$(): Observable<Ad>
    {
        return this._ad.asObservable();
    }

    /**
     * Getter for banner
     */
    get banner$(): Observable<Banner>
    {
        return this._banner.asObservable();
    }
    
    /**
     * Getter for mobile banners
     */
    get bannersMobile$(): Observable<Banner[]>
    {
        return this._bannersMobile.asObservable();
    }

    /**
     * Getter for desktop banners
     */
     get bannersDesktop$(): Observable<Banner[]>
     {
         return this._bannersDesktop.asObservable();
     }

    /**
     * Setter & getter for ads
     *
     * @param value
     */
     set ads(value: Ad[])
     {
         // Store the value
         this._ads.next(value);
     }

    get ads$(): Observable<Ad[]>
    {
        return this._ads.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
    * Set current platform
    */
    set(): Observable<any>
    {
        return of(true).pipe(
            switchMap(async (response: any) => {

                this._logging.debug("Response from AdsService (Set)", response);
                const message = encodeURI('Tell me more about joining Deliverin platform!')
                const ads = {
                    bannerUrl: this._apiServer.settings.apiServer.assetsService + "/store-assets/Join-Us-Banner_1366X700.png",
                    redirectUrl: "https://wa.me/60125033299" + '?text=' + message
                };
                this._ads.next([ads]);

                return [ads];
            })
        );
    }

    getBanner(regionCountryId: string = "" ): Observable<Banner[]>
    {
        let productService = this._apiServer.settings.apiServer.productService;
        let accessToken = "accessToken";

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: {
                regionCountryId: regionCountryId,
            }
        };

        if (regionCountryId === "") {
            delete header.params.regionCountryId;
        }

        return this._httpClient.get<Banner[]>(productService + '/banner-config', header).pipe(
            tap((response) => {
                
                const data = response['data'];

                let desktop = data.filter(element => element.type === 'DESKTOP')
                let mobile = data.filter(element => element.type === 'MOBILE')
                this._logging.debug("Response from AdsService (getBanner -Mobile)", mobile);
                this._logging.debug("Response from AdsService (getBanner -Desktop)", desktop);
                this._bannersDesktop.next(desktop);
                this._bannersMobile.next(mobile);

            })
        );
    }

}
