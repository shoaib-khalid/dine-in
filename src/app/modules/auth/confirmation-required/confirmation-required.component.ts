import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent
{
    //to be display the text
    titleText:string ='Confirmation Required';
    descriptionText:string ='A confirmation mail with instructions has been sent to your email address.Follow those instructions to confirm your email address and activate your account.';

    /**
     * Constructor
     */
    constructor()
    {
    }
}
