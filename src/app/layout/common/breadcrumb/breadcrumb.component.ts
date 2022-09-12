import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { IBreadCrumb } from './breadcrumb.types';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { LocationService } from 'app/core/location/location.service';
import { LandingLocation, ParentCategory } from 'app/core/location/location.types';
import { Subject, takeUntil } from 'rxjs';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';

@Component({
    selector       : 'breadcrumb',
    templateUrl    : './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit
{

    public breadcrumbs: IBreadCrumb[]
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _locationService: LocationService,
        private _platformsService: PlatformService,
        private _changeDetectorRef: ChangeDetectorRef,

    )
    {        
        this.breadcrumbs = this.buildBreadCrumb(this._activatedRoute.root);        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            distinctUntilChanged(),
        ).subscribe(() => {
            this.breadcrumbs = this.buildBreadCrumb(this._activatedRoute.root);
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Recursively build breadcrumb according to activated route.
     * @param route
     * @param url
     * @param breadcrumbs
     */
    buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
        //If no routeConfig is available we are on the root path
        let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
        let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';        
        let routeId = null;
        // If the route is dynamic route such as ':id', remove it
        const lastRoutePart = path.split('/').pop();
        const isDynamicRoute = lastRoutePart.startsWith(':');
        if(isDynamicRoute && !!route.snapshot) {
            const paramName = lastRoutePart.split(':')[1];
            path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
            label = route.snapshot.params[paramName];
            routeId = paramName;
        }

        //In the routeConfig the complete path is not available,
        //so we rebuild it each time
        const nextUrl = path ? `${url}/${path}` : url;

        const breadcrumb: IBreadCrumb = {
            label: label,
            url: nextUrl,
            id: routeId
        };

        // Only adding route with non-empty label
        let newBreadcrumbs = breadcrumb.label ? [ ...breadcrumbs, breadcrumb ] : [ ...breadcrumbs];
        if (route.firstChild) {
            //If we are not on our current path yet,
            //there will be more children to look after, to build our breadcumb
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }

        // if breadcrumbs includes Location/Category path
        if (newBreadcrumbs.length > 0 && (newBreadcrumbs[0].label === 'Location' || newBreadcrumbs[0].label === 'Category')) {
            return newBreadcrumbs = this.changeBreadcrumbName(newBreadcrumbs);
        }
        else {
            return newBreadcrumbs;
        }
    }

    /**
     * Change breadcrumbs label
     * 
     * @param breadcrumbs 
     * @returns 
     */
    changeBreadcrumbName(breadcrumbs: IBreadCrumb[]) {
        let locationIndex = breadcrumbs.findIndex(bread => bread.id === 'location-id');
        let categoryIndex = breadcrumbs.findIndex(bread => bread.id === 'category-id');

        if (locationIndex > -1) {
            // Get current location with locationId 
            this._locationService.featuredLocation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((location : LandingLocation) => {
                if (location) {
                    breadcrumbs[locationIndex].label = location.cityDetails.name;
                    // Mark for check
                    this._changeDetectorRef.markForCheck();

                }
            });
        }
        if (categoryIndex > -1) {
            // Get current category with parentCategoryId
            this._locationService.parentCategory$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((category : ParentCategory) => {
                if (category) {
                    breadcrumbs[categoryIndex].label = category.parentName;
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
            });
        }
        return breadcrumbs;
    }

}
