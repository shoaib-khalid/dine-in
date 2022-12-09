import { DOCUMENT } from '@angular/common';
import {ChangeDetectorRef, Inject, Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree} from '@angular/router';
import { AppConfig } from 'app/config/service.config';
import { OrderService } from 'app/core/_order/order.service';
import { VoucherModalComponent } from 'app/modules/customer/vouchers/voucher-modal/voucher-modal.component';
import { lastValueFrom, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GettingStartedGuardService implements CanActivate {
    dialogRef: any;

    constructor(
        private router: Router,
        @Inject(DOCUMENT) private _document: Document,
        public _dialog: MatDialog,
        private _orderService: OrderService
        ) {}
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            return this.validateToken(route)

        }

        async validateToken(route: ActivatedRouteSnapshot): Promise<boolean>
        {
            if (route.queryParams['token']) {

                let isValid: boolean = true;

                return await lastValueFrom(this._orderService.validateQRCode(route.queryParams['token']))
                    .catch(err => {
                        console.error(err.error.status);

                        // Check if dialog is already open
                        this.dialogRef = this._dialog.open( 
                            VoucherModalComponent,{
                                data:{ 
                                    icon: 'timer_off',
                                    title: 'Token Invalid',
                                    description: 'Please rescan the QR Code',
                                },
                                hasBackdrop: true,
                                disableClose: true
                            });

                        return this.dialogRef.afterClosed()
                            .subscribe(() => {

                                // Reload the app
                                this._document.location.href = 'https://' + AppConfig.settings.marketplaceDomain;
                                
                            });
                    })
            }   
            else return true;
        }
}