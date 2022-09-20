import { Route } from '@angular/router';
import { LandingGettingStartedComponent } from 'app/modules/landing/getting-started/getting-started.component';
import { StoreTagResolver } from './getting-started.resolver';

export const landingGettingStartedRoutes: Route[] = [
    {
        path        : '',  
        pathMatch   : 'full', 
        redirectTo  : '/'
    },
    {
        path        : ':store-tag',  
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
