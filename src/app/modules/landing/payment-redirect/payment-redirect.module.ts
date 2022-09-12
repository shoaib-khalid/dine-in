import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { LandingPaymentRedirectComponent } from 'app/modules/landing/payment-redirect/payment-redirect.component';
import { landingPaymentRedirectRoutes } from 'app/modules/landing/payment-redirect/payment-redirect.routing';

@NgModule({
    declarations: [
        LandingPaymentRedirectComponent,
    ],
    imports     : [
        RouterModule.forChild(landingPaymentRedirectRoutes),
        SharedModule
    ]
})
export class LandingPaymentRedirectModule
{
}
