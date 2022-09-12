import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { CartService } from 'app/core/cart/cart.service';
import { JwtService } from 'app/core/jwt/jwt.service';
import { forkJoin, Observable, throwError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CartsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _cartsService: CartService

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
        return forkJoin([
            this._cartsService.cartResolver()
        ]);
    }
}