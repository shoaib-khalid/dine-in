import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AppConfig } from 'app/config/service.config';
import { LogService } from 'app/core/logging/log.service';
import { AuthService } from '../auth/auth.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { JwtService } from '../jwt/jwt.service';
import { DeliveryRiderDetails, Order, OrderDetails, OrderGroup, OrderItem, OrderPagination, OrdersCountSummary } from './order.types';

@Injectable({
    providedIn: 'root'
})
export class OrderService
{
    private _orderGroup: ReplaySubject<OrderGroup> = new ReplaySubject<OrderGroup>(1);
    private _orderGroups: ReplaySubject<OrderGroup[]> = new ReplaySubject<OrderGroup[]>(1);
    private _orderGroupsPagination: BehaviorSubject<OrderPagination | null> = new BehaviorSubject(null);

    private _order: BehaviorSubject<Order | null> = new BehaviorSubject(null);
    private _orders: BehaviorSubject<Order[] | null> = new BehaviorSubject(null);
    private _ordersCountSummary: BehaviorSubject<OrdersCountSummary[] | null> = new BehaviorSubject(null);
    
    private _orderItems: BehaviorSubject<OrderItem[] | null> = new BehaviorSubject(null);
    private _ordersDetails: BehaviorSubject<OrderDetails[] | null> = new BehaviorSubject(null);
    private _ordersDetailsPagination: BehaviorSubject<OrderPagination | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
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

    /** Getter for groupOrder **/
    get orderGroup$(): Observable<OrderGroup> { return this._orderGroup.asObservable(); }
    /** Getter for groupOrders **/
    get orderGroups$(): Observable<OrderGroup[]> { return this._orderGroups.asObservable(); }
    /** Getter for groupOrders **/
    get orderGroupPagination$(): Observable<OrderPagination>{ return this._orderGroupsPagination.asObservable(); }

    /** Getter for ordersDetails **/
    get ordersDetails$(): Observable<OrderDetails[]> { return this._ordersDetails.asObservable(); }
    /** Getter for order pagination **/
    get ordersDetailsPagination$(): Observable<OrderPagination>{ return this._ordersDetailsPagination.asObservable(); }

    /** Getter for order **/
    get order$(): Observable<Order> { return this._order.asObservable(); }
    /** Getter for orders **/
    get orders$(): Observable<Order[]> { return this._orders.asObservable(); }
    /** Getter for orderItems **/
    get orderItems$(): Observable<any>{ return this._orderItems.asObservable(); }
    /** Getter for ordersCountSummary **/
    get ordersCountSummary$(): Observable<any> { return this._ordersCountSummary.asObservable(); }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // -------------
    // Order
    // -------------

    /**
     * Get the current logged in cart data
     */
    getOrderGroups(params: {
        page                    : number,
        pageSize                : number,
        orderGroupId?           : string,
        customerId?             : string,
        from?                   : string,
        to?                     : string
    } = {
        page                    : 0, 
        pageSize                : 10, 
        orderGroupId            : null,
        customerId              : null, 
        from                    : null,
        to                      : null,
    }):
    Observable<any>
    {        
        let orderService = this._apiServer.settings.apiServer.orderService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };

        // Delete empty value
        Object.keys(header.params).forEach(key => {
            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });        

        return this._httpClient.get<any>(orderService +'/ordergroups', header).pipe(
            map((response) => {

                this._logging.debug("Response from CartService (getOrderGroups)", response);

                let _pagination = {
                    length: response.data.totalElements,
                    size: response.data.size,
                    page: response.data.number,
                    lastPage: response.data.totalPages,
                    startIndex: response.data.pageable.offset,
                    endIndex: response.data.pageable.offset + response.data.numberOfElements - 1
                }                

                this._orderGroups.next(response.data.content);
                this._orderGroupsPagination.next(_pagination);

                return response["data"].content;
            })
        );
    }

    getOrderGroupsById(id: string): Observable<any>
    {
        let orderService = this._apiServer.settings.apiServer.orderService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {  
            headers: new HttpHeaders().set("Authorization", `Bearer ${this._authService.publicToken}`)
        };

        return this._httpClient.get<any>(orderService + '/ordergroups/' + id, header).pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap(async (response: any) => {
                this._logging.debug("Response from StoresService (getOrderGroupsById)",response);

                return response["data"];
            })
        );
    }

    /**
     * Get the Order Info
     */
    getOrderById(id: string): Observable<any>
    {
        let orderService = this._apiServer.settings.apiServer.orderService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;
        
        const header = {  
            headers: new HttpHeaders().set("Authorization", `Bearer ${this._authService.publicToken}`)
        };

        return this._httpClient.get<any>(orderService + '/orders/' + id, header)
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap(async (response: any) => {
                    this._logging.debug("Response from StoresService (getOrderById)",response);

                    return response["data"];
                })
            );
    }
     
    getOrdersWithDetails(customerId: string, page: number = 0, size: number = 3,  completionStatus: string | string[] = []): 
    Observable<{ pagination: OrderPagination; orders: Order[] }>
    {
        let orderService = this._apiServer.settings.apiServer.orderService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: {
                completionStatus,
                customerId : '' + customerId,
                page       : '' + page,
                pageSize   : '' + size,
            }
        };

        if (!completionStatus) { delete header.params.completionStatus; }

        return this._httpClient.get<any>(orderService + '/orders/details' , header)
        .pipe(
            tap((response) => {
                this._logging.debug("Response from orderService (getOrdersWithDetails)",response);

                let _pagination = {
                    length: response.data.totalElements,
                    size: response.data.size,
                    page: response.data.number,
                    lastPage: response.data.totalPages,
                    startIndex: response.data.pageable.offset,
                    endIndex: response.data.pageable.offset + response.data.numberOfElements - 1
                }
                this._ordersDetailsPagination.next(_pagination);  

                this._ordersDetails.next(response["data"].content);
            })
        );
    }
 
    getOrderItemsById(orderId): Observable<any>
    {
        let orderService = this._apiServer.settings.apiServer.orderService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
        };
        
        return this._httpClient.get<OrderItem[]>(orderService + '/orders/' + orderId + '/items', header)
        .pipe(
            tap((response) => {
                this._logging.debug("Response from OrdersService (getOrderItemsById)",response);
                this._orderItems.next(response.data);
            })
        )
    }

    getDeliveryRiderDetails(orderId): Observable<DeliveryRiderDetails>
    {
        let deliveryService = this._apiServer.settings.apiServer.deliveryService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
        };
        
        return this._httpClient.get<any>(deliveryService + '/orders/getDeliveryRiderDetails/' + orderId , header)
            .pipe(
                map((response) => {
                    this._logging.debug("Response from OrdersService (getDeliveryRiderDetails)",response);
                    return response["data"];
                })
            );
    }

    getCompletionStatus(orderId, nextCompletionStatus)
    {

        let orderService = this._apiServer.settings.apiServer.orderService;
        let accessToken = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).act;
        let clientId = this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
        };

        return this.orders$.pipe(
            take(1),
            switchMap(orders => this._httpClient.get<Order>(orderService + '/orders/details/' + orderId, header).pipe(
                map((response) => {

                    this._logging.debug("Response from OrdersService (getCompletionStatus) - Get Details By OrderId",response);

                    // Find the index of the updated product
                    const index = orders.findIndex(item => item.id === orderId);
                    
                    // Update the product
                    orders[index] = { ...orders[index], ...response["data"]};

                    // Update the products
                    this._orders.next(orders);

                    // Return the updated product
                    return response["data"];
                })
            ))
        );
    }
}
