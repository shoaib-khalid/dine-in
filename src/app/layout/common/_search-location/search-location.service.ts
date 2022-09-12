import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { switchMap, take, map, tap, catchError, filter } from 'rxjs/operators';
import { AppConfig } from 'app/config/service.config';
import { JwtService } from 'app/core/jwt/jwt.service';
import { takeUntil } from 'rxjs/operators';
import { LogService } from 'app/core/logging/log.service';
import { FormControl } from '@angular/forms';
import { CustomerSearch, StoreDetails } from './search-location.types';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService
{
    private _customerSearch: BehaviorSubject<CustomerSearch[] | null> = new BehaviorSubject(null);
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public searchControl: FormControl = new FormControl();
    private _routeUrl: BehaviorSubject<string | null> = new BehaviorSubject(null);
    private _storeDetails: BehaviorSubject<StoreDetails | null> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
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
     * Getter for customerSearch
     *
    */
    get customerSearch$(): Observable<CustomerSearch[]>
    {
        return this._customerSearch.asObservable();
    }

    /**
     * Setter for customerSearch
     *
     * @param value
     */
    set customerSearch(value: CustomerSearch[])
    {
        // Store the value
        this._customerSearch.next(value);
    }

    /**
     * Getter for customerSearch
     *
    */
    get localSearch$(): string
    {
        return localStorage.getItem('@customerSearch') ?? '[]';
    }

    /**
    * Setter for customerSearch
    *
    * @param value
    */
    set localSearch(value: CustomerSearch[])
    {
        // Store the value
        localStorage.setItem('@customerSearch', JSON.stringify(value));
        
    }  

    /**
     * Getter for search value
     *
    */
    get searchValue$(): Observable<CustomerSearch[]>
    {
        return this.searchControl.value;
    }
 
     /**
      * Setter for search value
      *
      * @param value
      */
    set searchValue(value: string)
    {
        // Store the value
        this.searchControl.setValue(value);
    }

    /**
     * Setter route url
     * 
     */
    set route(value: string)
    {
        this._routeUrl.next(value);
    }

    /**
     * Getter route url
     * 
     */
    get route$(): Observable<string>
    {
        return this._routeUrl.asObservable();
    }

    /**
     * Setter store details for _search
     * 
     */
    set storeDetails(value: StoreDetails)
    {
        this._storeDetails.next(value);
    }
 
     /**
      * Getter store details for _search
      * 
      */
    get storeDetails$(): Observable<StoreDetails>
    {
        return this._storeDetails.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
    * Get search history
    */
    get(): Observable<any>
    {
        let userService = this._apiServer.settings.apiServer.userService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let customerId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;        

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`)
        };
        
        if (customerId) {
            return this._httpClient.get<any>(userService + '/customer/' + customerId + '/search', header)
                .pipe(
                    map((response) => {
                        
                        this._logging.debug("Response from SearchService (Logged In)", response);
    
                        this._customerSearch.next(response["data"].content);

                        return response["data"].content;
                    })
                );
        } else {
            // this._customerSearch.next(JSON.parse(this.localSearch$));
            return of(JSON.parse(this.localSearch$))
        }
    }

    getCustomerSearchById(id: string): Observable<any>
    {
        let userService = this._apiServer.settings.apiServer.userService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let customerId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;  

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
        };
        
        return this._httpClient.get<any>(userService + '/customer/' + customerId + '/search/' + id, header)
        .pipe(
            map((response) => {
                this._logging.debug("Response from SearchService (getCustomerSearchById)", response);
                this._customerSearch.next(response["data"].content);

                return response["data"].content;
            })
        )
    }

    getCustomerSearchByCustomerId(id: string): Observable<any>
    {
        let productService = this._apiServer.settings.apiServer.productService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
        };
        
        return this._httpClient.get<any>(productService + '' + id , header)
        .pipe(
            map((response) => {
                this._logging.debug("Response from PlatformsService (getPlatformById)",response);
                this._customerSearch.next(response["data"]);

                return response["data"];
            })
        )
    }

    postCustomerSearch(searchBody: any): Observable<any>
    {
        let userService = this._apiServer.settings.apiServer.userService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let customerId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;  

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
        };

        return this.customerSearch$.pipe(
            take(1),
            switchMap(search => this._httpClient.post<any>(userService + '/customer/' + customerId + '/search', searchBody, header).pipe(
                map((response) => {

                    this._logging.debug("Response from SearchService (createSearch)", response);

                    let newResponse = response["data"];

                    this._customerSearch.next([newResponse, ...search]);

                    return response["data"];
                })
            ))
        );
    }

    deleteCustomerSearch (id: string): Observable<any>
    {
        let userService = this._apiServer.settings.apiServer.userService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let customerId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid; 

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
        };
        
        return this.customerSearch$.pipe(
            take(1),
            switchMap(search => this._httpClient.delete<any>(userService + '/customer/' + customerId + '/search/' + id, header).pipe(
                map((response) => {

                    this._logging.debug("Response from StoresService (deleteCustomerSearchById)",response);

                    // Find the index of the deleted product
                    const index = search.findIndex(item => item.id === id);

                    // Delete the product
                    search.splice(index, 1);

                    // Update the products
                    this._customerSearch.next(search);
                    
                    let isDeleted:boolean = false;
                    if (response["status"] === 200) {
                        isDeleted = true;
                    }

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    // deleteGuestSearch (searchText: any): Observable<any>
    // {        
    //     return of(JSON.parse(this.localSearch$)).pipe(
    //         take(1),
    //         switchMap(search => this._httpClient.delete<any>(searchText).pipe(
    //             map((response) => {

    //                 this._logging.debug("Response from StoresService (deleteGuestSearch)",response);

    //                 // Find the index of the deleted product
    //                 const index = search.findIndex(item => item.searchText === searchText);

    //                 // Delete the product
    //                 search.splice(index, 1);

    //                 // Update the products
    //                 JSON.parse(this.localSearch$).getItem('@customerSearch').next(search);
                    
    //                 let isDeleted:boolean = false;
    //                 if (response["status"] === 200) {
    //                     isDeleted = true;
    //                 }

    //                 // Return the deleted status
    //                 return isDeleted;
    //             })
    //         ))
    //     );
    // }

    post(storeBody: any): Observable<any>
    {
        let productService = this._apiServer.settings.apiServer.productService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: {
                "clientId": clientId
            }
        };
        
        return this.customerSearch$.pipe(
            take(1),
            // switchMap(products => this._httpClient.post<InventoryProduct>('api/apps/ecommerce/inventory/product', {}).pipe(
            switchMap(platforms => this._httpClient.post<any>(productService + '/stores', storeBody , header).pipe(
                map((response) => {

                    this._logging.debug("Response from PlatformsService (Create Platform)",response);

                    let newResponse = response["data"];

                    // Update the products with the new product
                    this._customerSearch.next([newResponse, ...platforms]);

                    // Return the new product
                    return response;
                })
            ))
        );
    }

    /**
     * Update the store
     *
     * @param store
     */
    update(id: string, body: any): Observable<any>
    {
        let productService = this._apiServer.settings.apiServer.productService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: {
                "clientId": clientId
            }
        };
        
        return this.customerSearch$.pipe(
            take(1),
            switchMap(stores => this._httpClient.put<any>(productService + '' + id, body , header).pipe(
                map((response) => {

                    this._logging.debug("Response from StoresService (Edit Store)",response);

                    // Find the index of the updated product
                    const index = stores.findIndex(item => item.id === id);

                    // Update the product
                    stores[index] = { ...stores[index], ...response["data"]};

                    // Update the products
                    this._customerSearch.next(stores);

                    // Return the new product
                    return response["data"];
                })
            ))
            
        );
    }

    /**
     * Delete the store
     * 
     * @param storeId
     */

    delete(id: string): Observable<any>
    {
        let productService = this._apiServer.settings.apiServer.productService;
        let accessToken = this._jwt.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: {
                "clientId": clientId
            }
        };
        
        return this.customerSearch$.pipe(
            take(1),
            switchMap(platforms => this._httpClient.delete(productService + '' + id, header).pipe(
                map((response) => {

                    this._logging.debug("Response from StoresService (Delete Store)",response);

                    // Find the index of the deleted product
                    const index = platforms.findIndex(item => item.id === id);

                    // Delete the product
                    platforms.splice(index, 1);

                    // Update the products
                    this._customerSearch.next(platforms);

                    let isDeleted:boolean = false;
                    if (response["status"] === 200) {
                        isDeleted = true;
                    }


                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
