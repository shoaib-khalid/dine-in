import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, throwError } from 'rxjs';
import { VoucherService } from 'app/core/_voucher/voucher.service';


@Injectable({
    providedIn: 'root'
})
export class VoucherResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _voucherService: VoucherService,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            this._voucherService.getAvailableCustomerVoucher(true),
            this._voucherService.getAvailableCustomerVoucher(false),
        ])
    }
}