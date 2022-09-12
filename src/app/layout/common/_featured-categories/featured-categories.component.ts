import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
// import Swiper core and required modules
import SwiperCore, { Grid, Navigation } from "swiper";
import { SwiperComponent } from 'swiper/angular';

// install Swiper modules
SwiperCore.use([Grid, Navigation]);


@Component({
    selector     : 'featured-categories',
    templateUrl  : './featured-categories.component.html',
    encapsulation: ViewEncapsulation.None,
    styles       : [
        /* language=SCSS */
        `
        @import "swiper/css";
        @import "swiper/css/pagination";
        @import "swiper/css/navigation";
        @import "swiper/css/grid";

        .swiper {
            width: 100%;
            height: 100%;
            margin-left: auto;
            margin-right: auto;
        }

        // .swiper-wrapper {
        //     margin-bottom: 10px;
        // }
          
        .swiper-slide {
            text-align: center;
            font-size: 18px;
            background: #fff;
            height: calc((100% - 30px) / 2) !important;
            
            /* Center slide text vertically */
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-align-items: center;
            align-items: center;
        }
        
        .swiper-slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Pagination */
        // .swiper-pagination-progressbar-fill {
        //     background: var(--fuse-primary) !important;

        // }
        // .swiper-horizontal > .swiper-pagination-progressbar, .swiper-pagination-progressbar.swiper-pagination-horizontal {
        //     top: 99% !important;
        // }      
        `],
})
export class _FeaturedCategoriesComponent implements OnInit, OnDestroy
{
    @ViewChild(SwiperComponent) _swiper: SwiperComponent;

    platform: Platform;
    @Input() categories: any;
    @Input() location: any;
    @Input() title: string = "Categories";
    @Input() showViewAll: boolean = false;
    @Input() selectedCategoryId: string = null;
    @Input() redirectURL: { categoryId?: string, locationId?: string } = null;
    @Input() swiper: boolean = true;
    @Input() numberOfCols: number = 4;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    categoryId: string;


    /**
     * Constructor
     */
    constructor(
        private _platformService: PlatformService,
        private _router: Router,

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

    chooseCategory(parentCategoryId: string, locationId: string) {
        if (locationId) {
            this._router.navigate(['/location/' + locationId + '/' + parentCategoryId]);
        } else {
            this._router.navigate(['/category/' + parentCategoryId]);
        }
    }

    viewAll(){
        if (this.redirectURL) {
            this._router.navigate(['/category/category-list'], {queryParams: this.redirectURL});
        } else {
            this._router.navigate(['/category/category-list']);
        }
    }

    swipePrev() {
        this._swiper.swiperRef.slidePrev();
    }
    swipeNext() {
        this._swiper.swiperRef.slideNext();
    }
}
