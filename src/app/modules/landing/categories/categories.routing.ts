import { Route } from '@angular/router';
import { LandingLocationsComponent } from '../locations/location-list/location-list.component';
import { LandingCategoriesComponent } from './category-list/category-list.component';
import { CategoryComponent } from './category/category.component';

export const landingCategoriesRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'category-list'
    },
    {
        path     : 'category-list',
        data     : {
            breadcrumb: ''
        },
        children   : [
            {
                path : '',
                data: {
                    headerTitle: 'Category List',
                    breadcrumb: ''
                },
                component: LandingCategoriesComponent
            }
        ],
    },
    {
        path        : ':category-id',
        data     : {
            breadcrumb: ''
        },
        children    : [
            {
                path: '',
                data: {
                    headerTitle: 'Category Details',
                    breadcrumb: ''
                },
                component: CategoryComponent,
            },
            {
                path        : ':location-id',
                data     : {
                    headerTitle: 'Location Details',
                    breadcrumb: ''
                },
                component: CategoryComponent,
            },
        ],
    },
];
