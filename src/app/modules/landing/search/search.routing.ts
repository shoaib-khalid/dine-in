import { Route } from '@angular/router';
import { LandingSearchComponent } from 'app/modules/landing/search/search.component';
import { StoresResolver } from '../stores/stores.resolvers';

export const landingSearchRoutes: Route[] = [
    {
        // path     : '',
        // component: LandingHomeComponent

        path     : '',
        children   : [
            {
                path: '',
                // resolve  : {
                //     stores: StoresResolver,
                // },
                component: LandingSearchComponent,
            }
        ],
    },

    
    
];
