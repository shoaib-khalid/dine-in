import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, ReplaySubject } from 'rxjs';
import { AppConfig } from 'app/config/service.config';
import { LogService } from 'app/core/logging/log.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '../jwt/jwt.service';

@Injectable({
    providedIn: 'root'
})
export class DeliveryService
{

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiServer: AppConfig,
        private _authService: AuthService,
        private _jwtService: JwtService,
        private _logging: LogService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // -------------
    // Order
    // -------------

    /**
     * Get the current logged in cart data
     */
    getDeliveryOrderStatusList(orderId: string): Observable<any>
    {
        let deliveryService = this._apiServer.settings.apiServer.deliveryService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: {
                orderId: orderId
            }
        };     

        return this._httpClient.get<any>(deliveryService +'/orders/getDeliveryOrderStatusList', header).pipe(
            map((response) => {

                this._logging.debug("Response from DeliveryService (getDeliveryOrderStatusList)", response);

                return response["data"];
            })
        );
    }
}
