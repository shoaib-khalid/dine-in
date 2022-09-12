import { Route } from '@angular/router';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherResolver } from './vouchers.resolver';

export const voucherRoutes: Route[] = [
    {
        path     : '',
        children   : [
            {
                path: '',
                resolve  : {
                    address: VoucherResolver,
                },
                data: {
                    headerTitle: 'My Vouchers'
                },
                component: VoucherListComponent,
            }
        ],
    }

]; 
