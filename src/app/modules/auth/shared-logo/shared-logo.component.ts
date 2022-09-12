import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'app-shared-logo',
    templateUrl  : './shared-logo.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SharedLogoComponent implements OnInit
{
    image: any = [];
    countryCode:string = '';
    @Input() titleText: string;
    @Input() descriptionText: string;

    platform: Platform;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformsService: PlatformService,
        private _router: Router,
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
        // Subscribe to platform data
        this._platformsService.platform$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((platform) => {
                if (platform) {
                    this.platform = platform;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    goToHome() {
        this._router.navigate(['']);

        // Navigate to the internal redirect url (temporary)
        // const redirectURL = this.platform.name === "DeliverIn" ? "https://www.deliverin.my" : "https://www.easydukan.co";
        // this._document.location.href = redirectURL;
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

}
