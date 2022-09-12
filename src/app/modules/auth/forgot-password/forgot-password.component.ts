import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { Subject } from 'rxjs';
import { Platform } from 'app/core/platform/platform.types';
import { PlatformLocation } from '@angular/common';
import { AppConfig } from 'app/config/service.config';


@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    platform: Platform;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;

    //to be display the text
    titleText:string ='Forgot password?';
    descriptionText:string ='Please enter the email address to retrieve reset link';

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    urlfull :string;
    platformname:string;
    domain :string = '';

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _platformsService: PlatformService,
        private _formBuilder: FormBuilder,
        private _platformLocation: PlatformLocation,
        private _apiServer: AppConfig,

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

        this.domain = this._apiServer.settings.storeFrontDomain;

        // Subscribe to platform data
        this._platformsService.platform$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((platform: Platform) => {
            this.platform = platform;
            this.platformname = this.platform.name.toLowerCase();
            
        });

        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.urlfull = (this._platformLocation as any).location.origin;
  

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
        // Return if the form is invalid
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Forgot password
        this._authService.forgotPassword(this.forgotPasswordForm.get('email').value, this.domain , this.urlfull + '/reset-password')
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                    this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Password reset sent! You\'ll receive an email if you are registered on our system.'
                    };
                },
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: response.error.message
                    };
                }
            );
    }
}
