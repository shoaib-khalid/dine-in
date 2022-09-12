import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { CartService } from 'app/core/cart/cart.service';
import { CustomerAuthenticate } from '../auth.types';
import { CartItem } from 'app/core/cart/cart.types';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanActivateChild, CanLoad
{
    customerAuthenticate: CustomerAuthenticate;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _cartsService: CartService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {        
        return this._check(route);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        return this._check(null);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._check(null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @private
     */
    private _check(route?: ActivatedRouteSnapshot): Observable<boolean>
    {
        
        const redirectUrl = route ? route.queryParamMap.get('redirectURL') : null
        const guestCartId = route ? route.queryParamMap.get('guestCartId') : null
        const storeId = route ? route.queryParamMap.get('storeId') : null
                
        // Check the authentication status
        return this._authService.check()
        .pipe(
            switchMap((authenticated) => {

                // If the user is authenticated...
                if ( authenticated )
                {
                    this._authService.customerAuthenticate$
                        .subscribe((response: CustomerAuthenticate) => {

                            this.customerAuthenticate = response;

                            // merge multiple guests carts
                            let cartIds: { id: string, storeId: string, cartItems: CartItem[]}[] = this._cartsService.cartIds$ ? JSON.parse(this._cartsService.cartIds$) : [];
                                
                            if (cartIds.length > 0) {

                                this._cartsService.mergeMultipleCarts(this.customerAuthenticate.session.ownerId, cartIds.map(cart => cart.id))
                                .subscribe(()=> {
                                    // Resolve cart after merge
                                    this._cartsService.cartResolver().subscribe();
                                    this._cartsService.cartResolver(true).subscribe();
                                })

                            }
                            // MERGE CART
                            if (guestCartId && storeId) {  
                            
                                this._cartsService.mergeAndRedirect(guestCartId, storeId, this.customerAuthenticate.session.ownerId, redirectUrl);
                            
                            } 
                            else {
                                // Redirect to the root
                                this._router.navigate(['/']);
                            }
                        });
                    

                    // Prevent the access
                    return of(false);

                }
                // Allow the access
                return of(true);
            })
        );
    }
}
