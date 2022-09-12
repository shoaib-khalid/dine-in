import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { JwtService } from 'app/core/jwt/jwt.service';
import { UserService } from 'app/core/user/user.service';
import { CustomerAddress } from 'app/core/user/user.types';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAccountComponent implements OnInit
{
    alert: any;
    accountForm: FormGroup;
    clientId: string;

    currentScreenSize: string[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        public _dialog: MatDialog,
        private _jwtService: JwtService,
        private _authService: AuthService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
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
        // Create the form
        this.accountForm = this._formBuilder.group({
            name        : ['', Validators.required],
            username    : [{value:'', disabled:true}, Validators.required],
            email       : [{value:'', disabled:true}, [Validators.required, Validators.email]],
            phoneNumber : ['', Validators.required]
       
        });
    
        // ----------------------
        // Get client Details
        // ----------------------

        // Customer Details
        this._userService.get(this._jwtService.getJwtPayload(this._authService.jwtAccessToken).uid)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response)=>{
                this.accountForm.patchValue(response);
            });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {               

                this.currentScreenSize = matchingAliases;                

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Mark for check
        this._changeDetectorRef.markForCheck();

    }

    /**
     * Send the form
     */
    updateClientProfile(): void
    {
        // Do nothing if the form is invalid
        if ( this.accountForm.invalid )
        {
            return;
        }

        // Hide the alert
        this.alert = false;

        // Disable the form
        // this.accountForm.disable();

        // update profile
        this._userService.putCustomerById(this.accountForm.value)
        .subscribe((response)=>{
            // Show a success message (it can also be an error message)
            if(response.status === 202)
            {
                const confirmation = this._fuseConfirmationService.open({
                    title  : 'Success',
                    message: 'Your profile has been updated successfully!',
                    icon: {
                        show: true,
                        name: "heroicons_outline:check",
                        color: "success"
                    },
                    actions: {
                        confirm: {
                            label: 'OK',
                            color: "primary",
                        },
                        cancel: {
                            show: false,
                        },
                    }
                });
            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
            
        })

        setTimeout(() => {
            this.alert = null;
        }, 7000);

        // Enable the form
        // this.accountForm.enable();
    }
    
}
