import { Route } from '@angular/router';
import { LandingGettingStartedComponent } from 'app/modules/landing/getting-started/getting-started.component';
import { GettingStartedGuardService } from './getting-started.guard';
import { StoreTagResolver } from './getting-started.resolver';

export const landingGettingStartedRoutes: Route[] = [
    {
        path        : '',  
        pathMatch   : 'full', 
        redirectTo  : '/'
    },
    {
        path        : ':store-tag',  
        // canActivate : [GettingStartedGuardService],
        children    : [
            {
                path: '',
                component: LandingGettingStartedComponent
            }
        ],
        resolve     : {
            storeTag: StoreTagResolver
        }
    }
];
