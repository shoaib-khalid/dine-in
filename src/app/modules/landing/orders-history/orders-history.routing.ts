import { Route } from '@angular/router';
import { OrderHistoryDetailsComponent } from './orders-history-details/orders-history-details.component';
import { OrdersHistoryComponent } from './orders-history.component';

export const ordersHistoryRoutes: Route[] = [
    {
        path     : '',
        children   : [
            {
                path: '',
                component: OrdersHistoryComponent,
            },
        ],
    },
    {
        path            : 'orders-history-details/:order-id',
        children        : [
            {
                path: '',
                component: OrderHistoryDetailsComponent,
            }
        ],
    }
]; 
