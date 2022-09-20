import { Route } from '@angular/router';
import { LandingProductDetailsComponent } from './product-details/product-details.component';
import { ProductResolver } from './product-details/product-details.resolver';
import { LandingShopComponent } from './shop/shop.component';
import { LandingStoresComponent } from './store-list/store-list.component';
import { LandingStoreComponent } from './store/store.component';
import { StoresResolver } from './stores.resolvers';

export const landingStoresRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'store-list'
    },
    {
        path     : 'store-list',
        data: {
            headerTitle: 'All Stores',
            breadcrumb: ''
        },
        component: LandingStoresComponent
    },
    {
        path     : ':store-slug',
        data     : {
            breadcrumb: ''
        },
        children   : [
            {
                path     : '',
                pathMatch : 'full',
                redirectTo: 'all-products',
            },
            {
                path: ':catalogue-slug',
                data     : {
                    breadcrumb: ''
                },
                children: [
                    {
                        path: '',
                        component: LandingShopComponent,
                    },
                    {
                        path: ':product-slug',
                        data     : {
                            breadcrumb: ''
                        },
                        component: LandingProductDetailsComponent,
                        resolve  : {
                            product: ProductResolver,
                        }
                    }
                ],
            }
        ],
        resolve  : {
            stores: StoresResolver
        }
    }
];
