import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { FloatingBannerService } from 'app/core/floating-banner/floating-banner.service';
import { PopUpBanner } from 'app/core/floating-banner/floating-banner.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
    selector       : 'floating-message-big',
    templateUrl    : './floating-message-big.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'floating-message-big'
})
export class FloatingMessageBigComponent implements OnInit, OnDestroy
{
    currentScreenSize: string[];
    promoBig: PopUpBanner[];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _changeDetectorRef: ChangeDetectorRef,
        private _floatingBannerService: FloatingBannerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._floatingBannerService.promoBig$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((promoBig: PopUpBanner[]) => {
                if (promoBig) {                    
                    this.promoBig = promoBig;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                this.currentScreenSize = matchingAliases;
            });
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

    closeMessage() {
        this._floatingBannerService.closeBigBanner();
        this.promoBig = null;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    uponClicked(id: string) {
        let index = this.promoBig.findIndex(item => item.id === id);
        if (index > -1){
            this._document.location.href = this.promoBig[index].actionUrl;
        }
    }

    backdropClick() {
        this.closeMessage();
    }
}
