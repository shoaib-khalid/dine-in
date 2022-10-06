import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { LocationService } from "app/core/location/location.service";
import { DiningService } from "app/core/_dining/dining.service";
import { forkJoin, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StoreTagResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _diningService: DiningService,
        private _locationService: LocationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let storeTagArray: string[] = state.url.split("/");
        let storeTag = storeTagArray[2] ? storeTagArray[2] : "";
        
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            this._diningService.setStoreTag(storeTag),
            this._locationService.getTags({ page:0, pageSize: 1, sortByCol: "keyword", sortingOrder: "ASC", tagKeyword: storeTag})
            // this._httpstatService.get(500)
        ]);
    }
}
