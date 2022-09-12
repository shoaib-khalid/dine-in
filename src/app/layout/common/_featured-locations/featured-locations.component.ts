import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, filter, map, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';

@Component({
    selector     : 'featured-locations',
    templateUrl  : './featured-locations.component.html',
    encapsulation: ViewEncapsulation.None
})
export class _FeaturedLocationsComponent implements OnInit, OnDestroy
{

    platform: Platform;
    @Input() locations: any;
    @Input() category: any;
    @Input() title: string = "Locations";
    @Input() showViewAll: boolean = false;
    @Input() redirectURL: { categoryId?: string, locationId?: string } = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _platformService: PlatformService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._platformService.platform$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((platform: Platform)=>{
                this.platform = platform;
            })   
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

    chooseLocation(locationId: string, parentCategoryId?: string) {
        if (parentCategoryId) {
            this._router.navigate(['/category/' + parentCategoryId + '/' + locationId]);
        } else {
            this._router.navigate(['/location/' + locationId]);
        }
    }

    chooseStore(storeDomain:string) {
        let slug = storeDomain.split(".")[0]
        this._router.navigate(['/store/' + slug]);
    }

    viewAll(){
        if (this.redirectURL) {
            this._router.navigate(['/location/location-list'], {queryParams: this.redirectURL});
        } else {
            this._router.navigate(['/location/location-list']);
        }
    }
}
