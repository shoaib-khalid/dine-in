import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { CartService } from 'app/core/cart/cart.service';
import { CheckoutService } from 'app/core/checkout/checkout.service';
import { JwtService } from 'app/core/jwt/jwt.service';
import { ProductsService } from 'app/core/product/product.service';
import { UserService } from 'app/core/user/user.service';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AddressResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _checkoutService: CheckoutService,
        private _jwt: JwtService,
        private _authService: AuthService,
        private _router: Router
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
        return this._checkoutService.getCustomerAddress(this._jwt.getJwtPayload(this._authService.jwtAccessToken).uid);
    }
}