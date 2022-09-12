import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { StoresService } from 'app/core/store/store.service';
import { map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { Subject } from 'rxjs';


@Component({
    selector     : 'app-shared-background',
    templateUrl  : './shared-background.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SharedBackgroundComponent implements OnInit
{
    @Input() pageType: string ;

    image: any=[];
    countryCode:string='';

    platform: Platform;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _storesService: StoresService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformsService: PlatformService,

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
            .subscribe((platform: Platform) => {
                if (platform) {
                    this.platform = platform;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
      
    }



}
