import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { switchMap, take, map, tap, catchError, filter } from 'rxjs/operators';
import { AppConfig } from 'app/config/service.config';
import { JwtService } from 'app/core/jwt/jwt.service';
import { LogService } from 'app/core/logging/log.service';

@Injectable({
    providedIn: 'root'
})
export class HttpStatService
{
    private _httpstat: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiServer: AppConfig,
        private _jwt: JwtService,
        private _logging: LogService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for httpstat
     *
    */
    get httpstat$(): Observable<any>
    {
        return this._httpstat.asObservable();
    }

    /**
     * Setter for httpstat
     *
     * @param value
     */
    set httpstat(value: any)
    {
        // Store the value
        this._httpstat.next(value);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
    * Get mockup http code
    */
    get(httpCode: number): Observable<any>
    {
        let httpStat = 'https://httpstat.us';
        // let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        // let clientId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;        

        // const header = {
        //     headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`)
        // };
        
        return this._httpClient.get<any>(httpStat + '/' + httpCode)
        .pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap(async (response: any) => {
                            
                this._logging.debug("Response from HttpStat (get) " + httpCode, response);
                this._httpstat.next(response);
            })
        );
    }
}
