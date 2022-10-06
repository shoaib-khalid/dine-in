import { Route } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { RedirectGuard } from 'app/core/navigation/redirect.guard';

export const landingHomeRoutes: Route[] = [
    {
        path        : '',  
        // canActivate : [RedirectGuard],
        // component   : RedirectGuard,
        children    : [
            {
                path: '',
                component: LandingHomeComponent,
            }
        ]
    },
];
