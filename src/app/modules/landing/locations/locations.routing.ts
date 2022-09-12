import { Route } from '@angular/router';
import { LandingLocationsComponent } from './location-list/location-list.component';
import { LocationComponent } from './location/location.component';

export const landingLocationsRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'location-list'
    },
    {
        path     : 'location-list',
        data: {
            headerTitle: 'Locations',
            breadcrumb: ''
        },
        component: LandingLocationsComponent
    },
    {
        path     : ':location-id',
        data     : {
            breadcrumb: ''
        },
        children   : [
            {
                path: '',
                data: {
                    headerTitle: 'Location Details',
                    breadcrumb: ''
                },
                component: LocationComponent,
            },
            {
                path     : ':category-id',
                data: {
                    headerTitle: 'Category Details',
                    breadcrumb: ''
                },
                component: LocationComponent,

            },  
            
        ],
    },
    // {
    //     path     : ':location-id/:category-id',
    //     children   : [
    //         {
    //             path: '',
    //             data: {
    //                 headerTitle: 'Category Details'
    //             },
    //             component: LocationComponent,
    //         }
            
    //     ],
    // },    
];
