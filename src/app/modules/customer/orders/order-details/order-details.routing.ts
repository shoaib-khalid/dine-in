import { Route } from '@angular/router';
import { OrderDetailsComponent } from './order-details.component';
import { OrderDetailsResolver } from './order-details.resolver';

export const orderDetailsRoutes: Route[] = [
    {
        path    : ':order-id',
        resolve  : {
            order: OrderDetailsResolver,
            // categories: StoreCategoriesResolver
        },

        component: OrderDetailsComponent
    },
    {
        path     : '',
        redirectTo: '/buyers/order',
        component: OrderDetailsComponent
    }
];