import { Route } from '@angular/router';
import { LandingRestaurantsComponent } from './restaurant-list/restaurant-list.component';

export const landingStoresRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: '/'
    },
    {
        path     : 'restaurant-list',
        data: {
            headerTitle: 'All Stores',
            breadcrumb: ''
        },
        component: LandingRestaurantsComponent
    }
];
