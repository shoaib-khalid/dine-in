import { Route } from '@angular/router';
import { LandingThankyouComponent } from 'app/modules/landing/thankyou/thankyou.component';

export const landingThankyouRoutes: Route[] = [
    {
        path     : ':status/:payment-type/:completion-status',
        component: LandingThankyouComponent
    },
    {
        path        : '',
        pathMatch   : 'full',
        redirectTo  : '/'
    }
];
