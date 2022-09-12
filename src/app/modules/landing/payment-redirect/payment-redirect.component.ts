import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoresService } from 'app/core/store/store.service';
import { OrderService } from 'app/core/_order/order.service';
import { DOCUMENT } from '@angular/common';
import { DisplayErrorService } from 'app/core/display-error/display-error.service';


@Component({
    selector     : 'landing-payment-redirect',
    template     : ``,
    encapsulation: ViewEncapsulation.None,
    styles       : [``]
})
export class LandingPaymentRedirectComponent
{
    payment: any = {
        name: null,
        email: null,
        phone: null,
        amount: null,
        hash: null,
        status_id: null,
        order_id: null,
        transaction_id: null,
        msg: null
    }

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _displayErrorService: DisplayErrorService,
        private _orderService: OrderService,
        private _storesService: StoresService
    )
    {
    }

    ngOnInit() {
        this._activatedRoute.queryParams.subscribe(params => {

            // senangPay redirect
            this.payment.name = params['name'];
            this.payment.email = params['email'];
            this.payment.phone = params['phone'];
            this.payment.amount = params['amount'];
            this.payment.hash = params['hash'];
            this.payment.status_id = params['status_id'];
            this.payment.order_id = params['order_id'];
            this.payment.transaction_id = params['transaction_id'];
            this.payment.msg = params['msg'];

            // fastPay redirect
            if (this.payment.msg !== "Payment_was_successful" && params['err_code']){
                this.payment.msg = params['err_code'];
                this.payment.msg = this.payment.msg + "-" + params['err_msg'];
                this.payment.transaction_id = params['basket_id'];
            }

            let status;
            if (this.payment.status_id == "1" || this.payment.status_id == 1) {
                status = "SUCCESS"
            } else {
                status = "FAILED"
            }

            if (this.payment.order_id) {
                if (this.payment.order_id.charAt(0) === "G") {
                    this._orderService.getOrderGroupsById(this.payment.order_id)
                        .subscribe((response)=>{                            
                            if (response) {
                                let paymentType = "ONLINEPAYMENT";//response.paymentType;
                                this._router.navigate(['/thankyou/' + status + '/' + paymentType + '/' + this.payment.msg ]);
                            } else {
                                this._router.navigate(['/thankyou/FAILED/UNKNOWN/ORDER_NOT_FOUND']);
                            }
                        });
                } else {
                    this._orderService.getOrderById(this.payment.order_id)
                        .subscribe((response) => {
                            if (response) {
                                let storeId = response.storeId;
                                let paymentType = response.paymentType;
                
                                // getStoreById(storeId, cartId) , does not need cartId here 
                                // since we're redirecting to another page (SF of the store)
                                this._storesService.getStoreById(storeId)
                                    .subscribe((storeResponse) => {
                                        let storeDomain = storeResponse.domain;
                                        this._document.location.href = 'https://' + storeDomain + '/thankyou/' + status + '/' + paymentType + '/' + this.payment.msg;
                                    });
                            } else {
                                this._router.navigate(['/thankyou/FAILED/UNKNOWN/ORDER_NOT_FOUND']);
                            }
                        });
                }
            } else {
                this._displayErrorService.show({type: "4xx", code: "404", title: "Page Not Found!", message: "The page you are looking for might have been removed, had its name changed or is temporarily unavailable."})
            }
    
        });
    }
}
