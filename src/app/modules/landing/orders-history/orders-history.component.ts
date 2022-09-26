import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AuthService } from 'app/core/auth/auth.service';
import { CustomerAuthenticate } from 'app/core/auth/auth.types';
import { CartService } from 'app/core/cart/cart.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { StoresService } from 'app/core/store/store.service';
import { OrderService } from 'app/core/_order/order.service';
import { Order, OrderDetails, OrderGroup, OrderItemWithDetails, OrderPagination } from 'app/core/_order/order.types';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector     : 'orders-history',
    templateUrl  : './orders-history.component.html',
    styles       : [
        `
            /** Custom input number **/
            input[type='number']::-webkit-inner-spin-button,
            input[type='number']::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }

            input[type='number'] {
                -moz-appearance:textfield;
            }
        
            .custom-number-input input:focus {
            outline: none !important;
            }
        
            .custom-number-input button:focus {
            outline: none !important;
            }

            ngx-gallery {
                position: relative;
                z-index: 10;
            }
        `
    ]
})
export class OrdersHistoryComponent implements OnInit
{  

    @ViewChild("ordersDetailsPaginator", {read: MatPaginator}) private _ordersDetailsPaginator: MatPaginator;
    @ViewChild("ordersGroupsPaginator", {read: MatPaginator}) private _ordersGroupsPaginator: MatPaginator;
    
    platform: Platform;

    // Orders 
    ordersDetails$: Observable<OrderDetails[]>;    
    ordersDetailsPagination: OrderPagination;
    ordersDetailsPageOfItems: Array<any>;

    ordersGroups$: Observable<OrderGroup[]>;    
    ordersGroupsPagination: OrderPagination;
    ordersGroupsPageOfItems: Array<any>;

    // Dine-In 
    userOrdersId: string;
    userGroupOrdersId: string;

    customerOrderIds: string [] = [];
    groupcustomerOrderIds: string [] = [];
    
    customerAuthenticate: CustomerAuthenticate;
    
    filterCustNameControl: FormControl = new FormControl();
    filterCustNameControlValue: string;
    
    openTab: string = "ALL";
    tabControl: FormControl = new FormControl();
    orderCountSummary: { id: string; label: string; completionStatus: string | string[]; count: number; class: string; icon: string; }[];

    currentScreenSize: string[] = [];
    isLoading: boolean = false;

    displayAllGroup: { orderGroupId: string, orderList: { orderId: string; orderItemsId: {orderItemId: string; isDisplay: boolean}[], isDisplayAll: boolean}[]}[];
    displayAll: { orderId: string; orderItemsId: {orderItemId: string; isDisplay: boolean}[], isDisplayAll: boolean}[];
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    flattenedPaymentDetails: any[];

    /**
    * Constructor
    */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _orderService: OrderService,
        private _router: Router,
        private _authService: AuthService,
        public _dialog: MatDialog,
        private _platformService: PlatformService,
        private _storesService: StoresService,
        private _cartService: CartService,
        private _titleService: Title
    )
    {
    }

    ngOnInit() :void {

        // this._httpstatService.get(503).subscribe((response) =>{});
        this._platformService.platform$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((platform: Platform) => {
            if (platform) {
                this.platform = platform;                

                // set title
                this._titleService.setTitle(this.platform.name + " | " + "Orders");

            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        let orderId = (this._cartService.orderIds$ && this._cartService.orderIds$ !== "" && this._cartService.orderIds$ !== "[]") ? JSON.parse(this._cartService.orderIds$) : []; 
        
        if (orderId.length > 0) {

            this.customerOrderIds = orderId.map( item => { return item.id }) ? orderId : this.customerOrderIds
            // Get customer group order ID
            this.groupcustomerOrderIds = orderId.map( item => { 
                if(item.id.charAt(0) === 'G'){
                    return item.id.substring(1);
                }
            });
        
            // resolver get order with details
            this._orderService.getOrdersWithDetails(this.customerOrderIds, 0,3)
                .subscribe((response) => {
        
                });

            // resolver get group order with details
            this._orderService.searchOrderGroup({ page:0, pageSize: 3, orderGroupIds: this.groupcustomerOrderIds})
            .subscribe((orders: OrderGroup[]) => {
                
            });
            // set order details to be display and will be use in html
            this.ordersDetails$ = this._orderService.ordersDetails$;
            this.ordersGroups$ = this._orderService.orderGroups$;
        }
          
        this._orderService.ordersDetails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: OrderDetails[])=>{
                
                if (response) {                    
                    this.displayAll = response.map(item => {
                        return {
                            orderId: item.id,
                            orderItemsId: item.orderItemWithDetails.map((element, index) => {
                                return {
                                    orderItemId: element.id,
                                    isDisplay: index > 2 ? false : true
                                };
                            }),
                            isDisplayAll: item.orderItemWithDetails.length > 3 ? true : false
                        };
                    });
                }
                // Mark for change
                this._changeDetectorRef.markForCheck();
            });

        this._orderService.orderGroups$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: OrderGroup[])=>{
                if (response) {        
                    this.displayAllGroup = response.map(item => {
                        return {
                            orderGroupId: item.id,
                            orderList: item.orderList.map((element => {
                                return {
                                    orderId: element.id,
                                    orderItemsId: element.orderItemWithDetails.map((object, index) => {
                                        return {
                                            orderItemId: object.id,
                                            isDisplay: index > 2 ? false : true
                                        };
                                    }),
                                    isDisplayAll: element.orderItemWithDetails.length > 3 ? true : false
                                }
                            }))
                        };
                    });
                    
                    this.flattenedPaymentDetails = response.reduce(
                        (previousValue, currentValue) => previousValue.concat(currentValue.orderList),
                        [],
                    ).map((order: Order) => 
                        order.orderPaymentDetail
                    );
                }
                // Mark for change
                this._changeDetectorRef.markForCheck();
            });
        
        this.orderCountSummary = [
            { id: "ALL", label: "All", completionStatus: ["PAYMENT_CONFIRMED", "RECEIVED_AT_STORE", "BEING_PREPARED", "AWAITING_PICKUP", "BEING_DELIVERED", "DELIVERED_TO_CUSTOMER", "CANCELED_BY_MERCHANT"], count: 0, class: null, icon: null },
            { id: "TO_SHIP", label: "To Deliver", completionStatus: ["RECEIVED_AT_STORE","PAYMENT_CONFIRMED", "BEING_PREPARED", "AWAITING_PICKUP"], count: 0, class: "text-green-500 icon-size-5", icon: "heroicons_solid:clock" },            
            { id: "SENT_OUT", label: "Delivering", completionStatus: "BEING_DELIVERED", count: 0, class: "text-green-500 icon-size-5", icon: "mat_solid:local_shipping" },
            { id: "DELIVERED", label: "Delivered", completionStatus: "DELIVERED_TO_CUSTOMER", count: 0, class: "text-green-500 icon-size-5", icon: "heroicons_solid:check-circle" },
            { id: "CANCELLED", label: "Cancelled", completionStatus: "CANCELED_BY_MERCHANT", count: 0, class: "text-red-600 icon-size-5", icon: "heroicons_solid:x-circle" },
        ];

        // Get the orders details pagination
        this._orderService.ordersDetailsPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((ordersDetailsPagination: OrderPagination) => {
                if (ordersDetailsPagination) {
                    // Update the pagination
                    this.ordersDetailsPagination = ordersDetailsPagination;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the orders details pagination
        this._orderService.orderGroupPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response)=>{
                if(response) {                    
                    this.ordersGroupsPagination = response;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.tabControl.setValue(this.orderCountSummary.find(item => item.id === "ALL").completionStatus);        

        this.filterCustNameControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    this.filterCustNameControlValue = query;

                    return this._orderService.getOrdersWithDetails(this.customerOrderIds, 0, 10, this.tabControl.value);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();

        this.tabControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    //kena ubah
                    return this._orderService.getOrdersWithDetails(this.customerOrderIds, 0, 3, this.tabControl.value);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                this.currentScreenSize = matchingAliases;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        

        // Mark for check
        this._changeDetectorRef.markForCheck(); 
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

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        setTimeout(() => {
            if (this._ordersDetailsPaginator )
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();

                // Get products if sort or page changes
                merge(this._ordersDetailsPaginator.page).pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._orderService.getOrdersWithDetails(this.customerOrderIds, 0, 12);
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                ).subscribe();
            }
            if (this._ordersGroupsPaginator )
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();

                // Get products if sort or page changes
                merge(this._ordersGroupsPaginator.page).pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._orderService.searchOrderGroup({ page:0, pageSize: 3, orderGroupIds: this.groupcustomerOrderIds});
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                ).subscribe();
            }
        }, 0);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onChangePage(pageOfItems: Array<any>, type: string) {
        if (type === 'orderGroups') {           
            // update current page of items
            this.ordersGroupsPageOfItems = pageOfItems;
            
            if(this.ordersGroupsPagination && this.ordersGroupsPageOfItems['currentPage']) {
                if (this.ordersGroupsPageOfItems['currentPage'] - 1 !== this.ordersGroupsPagination.page) {
                    // set loading to true
                    this.isLoading = true;
                    this._orderService.searchOrderGroup({ page: this.ordersGroupsPageOfItems['currentPage'] - 1, pageSize: this.ordersGroupsPageOfItems['pageSize'], orderGroupIds: this.groupcustomerOrderIds})
                        .subscribe(()=>{
                            // set loading to false
                            this.isLoading = false;
                        });                        
                }
            }
        }
        if (type === 'orderDetails') {
            // update current page of items
            this.ordersDetailsPageOfItems = pageOfItems;
            
            if(this.ordersDetailsPagination && this.ordersDetailsPageOfItems['currentPage']) {
                if (this.ordersDetailsPageOfItems['currentPage'] - 1 !== this.ordersDetailsPagination.page) {
                    // set loading to true
                    this.isLoading = true;
                    this._orderService.getOrdersWithDetails(this.customerOrderIds,this.ordersDetailsPageOfItems['currentPage'] - 1, this.ordersDetailsPageOfItems['pageSize'], this.tabControl.value)
                        .subscribe(()=>{
                            // set loading to false
                            this.isLoading = false;
                        });
                }
            }
        }
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    redirectToProduct(storeId: string, storeDomain: string, seoName: string) {
        let domainName = storeDomain.split(".")[0];
        
        // this._document.location.href = url;
        this._router.navigate(['store/' + domainName + '/' + 'all-products/' + seoName]);

    }

    redirectToStore(storeDomain: string) {        
        let domainName = storeDomain.split(".")[0]
        // this._document.location.href = url;
        this._router.navigate(['store/' + domainName + '/' + 'all-products' ]);
    }

    convertDate(date: string) {
        let dateConverted = new Date(date.replace(/-/g, "/")).toISOString();
        return dateConverted;
    }

    showAllOrderItems(orderId: string) {
        let index = this.displayAll.findIndex(item => item.orderId === orderId);
        if (index > -1) {            
            this.displayAll[index].orderItemsId.forEach(item => {
                item.isDisplay = true;
            });
            this.displayAll[index].isDisplayAll = false;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    showAllGroupOrderItems(orderGroupId: string, orderId: string) {
        let groupOrderIndex = this.displayAllGroup.findIndex(item => item.orderGroupId === orderGroupId);
        let orderIndex = (groupOrderIndex > -1) ? this.displayAllGroup[groupOrderIndex].orderList.findIndex(item => item.orderId === orderId) : -1;

        if (orderIndex > -1) {            
            this.displayAllGroup[groupOrderIndex].orderList[orderIndex].orderItemsId.forEach(item => {
                item.isDisplay = true;
            });
            this.displayAllGroup[groupOrderIndex].orderList[orderIndex].isDisplayAll = false;            
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    checkCombineShipping(value) {
        
        let countObject = this.flattenedPaymentDetails.reduce((
            count,
            currentValue
        ) => {
            return (
                count[currentValue.deliveryQuotationReferenceId] ? ++count[currentValue.deliveryQuotationReferenceId] : (count[currentValue.deliveryQuotationReferenceId] = 1),
                count
            );
        },{});

        return countObject[value]
        
    }

    scrollToTop(){        
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
    }

    numberOfItems(orders: OrderItemWithDetails[]) {
        const sum = orders.reduce(
            (previousValue, currentValue) => previousValue + currentValue.quantity,
            0,
        );

        if (sum > 1) {
            return sum + " items"
        }
        else 
            return sum + " item"
        
    }

    goToExternalUrl(url: string, isOpenNewTab: boolean = false) {
        if (isOpenNewTab) {
            window.open(url,'_blank');
        } else {
            this._document.location.href = url;
        }
    }

}
