import { Route } from '@angular/router';
import { LandingPaymentRedirectComponent } from 'app/modules/landing/payment-redirect/payment-redirect.component';

export const landingPaymentRedirectRoutes: Route[] = [
    {
        // path     : ':name/:email/:phone/:amount/:hash/:status_id/:order_id/:transaction_id/:msg',
        path     : '',
        component: LandingPaymentRedirectComponent
    }
];
