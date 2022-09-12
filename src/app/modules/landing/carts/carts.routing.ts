import { Route } from '@angular/router';
import { CartListComponent } from './carts.component';

export const voucherRoutes: Route[] = [
    {
        path     : '',
        children   : [
            {
                path: '',
                data: {
                    headerTitle: 'My Carts'
                },
                component: CartListComponent,
            }
        ],
    }

]; 
