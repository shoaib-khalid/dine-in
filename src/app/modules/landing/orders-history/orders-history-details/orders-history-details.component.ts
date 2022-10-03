import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DeliveryOrderStatus, DeliveryRiderDetails, OrderDetails } from 'app/core/_order/order.types';
import { OrderService } from 'app/core/_order/order.service';
import { CustomerAuthenticate } from 'app/core/auth/auth.types';
import { DOCUMENT } from '@angular/common';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';


@Component({
    selector     : 'orders-history-details',
    templateUrl  : './orders-history-details.component.html',
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
export class OrderHistoryDetailsComponent implements OnInit
{  
    platform: Platform;

    orderId: string;
    orderDetails: OrderDetails;

    totalQuantity: number;
        
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _orderService: OrderService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _platformService: PlatformService,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit() {

        this.orderId = this._route.snapshot.paramMap.get('order-id');

        // getOrderById
        this._orderService.getOrderById(this.orderId)
            .subscribe((orderByIdResponse)=>{      
                                
                this.orderDetails = orderByIdResponse;

                this.totalQuantity = this.orderDetails.orderItemWithDetails.map(item => item.quantity).reduce((partialSum, a) => partialSum + a, 0);                
            });
        
        this._platformService.platform$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((platform: Platform) => {
            if (platform) {
                this.platform = platform;

            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    goToCatalogue() {
        history.back();
        // this._router.navigate(['/catalogue/'+this.categorySlug]);
    }

    // redirectToProduct(storeDomain: string, seoName: string) {
    //     let domainName = storeDomain.split(".")[0]
    //     let seo = seoName.split("/")[4]        
    //     // this._document.location.href = url;
    //     this._router.navigate(['store/' + domainName + '/' + 'all-products/' + seo]);
    // }

    redirectToStore(storeDomain: string) {
        let domainName = storeDomain.split(".")[0]
        // this._document.location.href = url;
        this._router.navigate(['store/' + domainName + '/' + 'all-products' ]);
    }

    convertDate(date: string) {
        let dateConverted = new Date(date.replace(/-/g, "/")).toISOString();
        return dateConverted;
    }

    goToExternalUrl(url: string, isOpenNewTab: boolean = false) {
        if (isOpenNewTab) {
            window.open(url,'_blank');
        } else {
            this._document.location.href = url;
        }
    }

}
