import { ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StoresService } from 'app/core/store/store.service';
import { Store, StoreAssets, StoreCategory } from 'app/core/store/store.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { AdsService } from 'app/core/ads/ads.service';
import { Banner } from 'app/core/ads/ads.types';
import { AppConfig } from 'app/config/service.config';
import { DOCUMENT } from '@angular/common';

SwiperCore.use([Pagination, Navigation, Autoplay]);


@Component({
    selector     : 'swiper-banner',
    templateUrl  : './swiper-banner.component.html',
    encapsulation: ViewEncapsulation.None,
    styles       : [
        /* language=SCSS */
        `
        @import "swiper/css";
        @import "swiper/css/pagination";
        @import "swiper/css/navigation";
        @import "swiper/css/effect-cards";

        .swiper {
            width: 100%;
            height: 100%;
          }
          
        .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;
        
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
        :host ::ng-deep .swiper-pagination { 
            top: 88%;
            left: -30% !important;
            
            @screen sm {
                top: 88%;
                left: -40% !important;
            }
            @screen md {
                top: 92%;
                left: -40% !important;
            }
            .swiper-pagination-bullet { 
                    background: #979797; 
                    width: 0.7rem; 
                    height: 0.7rem; 
                    opacity: 50%;
                } 

            .swiper-pagination-bullet-active { 
                background: var(--fuse-primary); 
                opacity: 1; 
                width: 40px;
                border-radius: 15px;
            } 
        }
        
        /* to customize Navigation buttons */
        // .swiper-button-next:after, .swiper-button-prev:after {
        //     position: absolute;
        //     top: 50%;
        //     width: calc(var(--swiper-navigation-size) / 44 * 27);
        //     height: var(--swiper-navigation-size);
        //     margin-top: calc(0px - var(--swiper-navigation-size) / 2);
        //     z-index: 10;
        //     cursor: pointer;
        //     display: flex;
        //     align-items: center;
        //     justify-content: center;
        //     color: var(--fuse-primary);

        // }
          
        `],

    // styleUrls    : ['./category-carousel.component.scss'],
})
export class _SwiperBannerComponent
{    

    @ViewChild(SwiperComponent) swiper: SwiperComponent;
    @Input() galleryImages: Banner[] = [];
    @Input() mobileGalleryImages: Banner[] = [];

    store: Store;

    currentScreenSize: string[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
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
 
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {               

                this.currentScreenSize = matchingAliases;                

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {

        setTimeout(() => {
            
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    swipePrev() {
        this.swiper.swiperRef.slidePrev();
    }
    swipeNext() {
        this.swiper.swiperRef.slideNext();
    }

    onSlideChange(swiper: any) {
        if (this.currentScreenSize.includes('sm')) {
            const delayInMs = this.galleryImages[swiper[0].realIndex].delayDisplay * 1000;
            swiper[0].params.autoplay.delay = delayInMs;
        }
        else {
            const delayInMs = this.mobileGalleryImages[swiper[0].realIndex].delayDisplay * 1000;
            swiper[0].params.autoplay.delay = delayInMs;
        }
    }

    actionOnClick(url: string) {
        if (url) {
            // this._router.navigate(['/promotion/' + url])
            this._document.location.href = url;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

}
