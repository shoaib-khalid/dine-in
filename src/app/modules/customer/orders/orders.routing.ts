import { Route } from '@angular/router';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderListComponent } from './order-list/order-list.component';

export const ordersRoutes: Route[] = [
    {
        path     : 'details/:order-id',
        children   : [
            {
                path: '',
                data: {
                    headerTitle: 'Order Details',
                    breadcrumb: 'Details'
                },
                component: OrderDetailsComponent,
            }
        ],
    },
    // buyer routes
    {
        path     : '',
        children   : [
            {
                path: '',
                data: {
                    headerTitle: 'My Orders'
                },
                component: OrderListComponent,
            }
        ]
    }
]; 
