import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, ReplaySubject, tap } from 'rxjs';
import { AppConfig } from 'app/config/service.config';
import { LogService } from 'app/core/logging/log.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '../jwt/jwt.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DiningService
{

    serviceType: 'tableService' | 'selfPickup';

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiServer: AppConfig,
        private _authService: AuthService,
        private _jwtService: JwtService,
        private _router: Router,
        private _logging: LogService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /** Setter for table number */
    set tableNumber(token: string) { sessionStorage.setItem('tableNumber', token); }
    /** Getter for table number */
    get tableNumber$(): string { return sessionStorage.getItem('tableNumber') ?? ''; }

    /** Setter for isTakeaway */
    set isTakeaway(token: boolean) { sessionStorage.setItem('tableNumber', token + ''); }
    /** Getter for isTakeaway */
    get isTakeaway$(): boolean { return JSON.parse(sessionStorage.getItem('tableNumber')) ?? false; }

    /** Setter for storeTag */
    set storeTag(storeTag: string) { sessionStorage.setItem('storeTag', storeTag + ''); }
    /** Getter for storeTag */
    get storeTag$(): string { return sessionStorage.getItem('storeTag') ?? ''; }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    requestDiningTable(state: RouterStateSnapshot): Observable<any>
    {
        return of(true).pipe(
            tap(()=>{

                let isGettingStartedPage: boolean = (state.url.indexOf("/getting-started") < 0) ? false : true;
                let isHomePage: boolean = (state.url === "/") ? true : false;
                let haveStoreTag: boolean = (this.storeTag$ && this.storeTag$ !== "") ? true : false;
                let haveStoreTable: boolean = (this.tableNumber$ && this.tableNumber$ !== "") ? true : false;

                if (isGettingStartedPage === false) {
                    if (haveStoreTag === false) {
                        if (!isHomePage) {
                            this._router.navigate(['/']);
                        }
                    } 
                    // if (isGettingStartedPage === false && haveStoreTag === true && haveStoreTable === false) {
                    //     this._router.navigate(['/getting-started/' + this.storeTag$]);
                    // }
                } else {
                    if (haveStoreTag === true && haveStoreTable === true) {
                        console.warn("Need to disable click cart");
                    }
                }
            })
        )
    }

    setStoreTag(storeTag: string): Observable<any>
    {
        return of(true).pipe(
            tap(()=>{
                this.storeTag = storeTag;                
            })
        );
    }
}
