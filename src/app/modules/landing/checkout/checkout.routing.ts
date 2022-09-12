import { Route } from '@angular/router';
import { BuyerCheckoutComponent } from './checkout.component';

export const BuyerCheckoutRoutes: Route[] = [
    {
        path        : '',
        children    : [
            {
                path    : '',
                data    : {
                    headerTitle : 'Checkout'
                },
                component: BuyerCheckoutComponent
            },
        ]
    }
];
