import { Route } from '@angular/router';
import { AddressSettingsComponent } from './address-setting.component';

export const addressSettingsRoutes: Route[] = [
    {
        path     : '',
        children   : [
            {
                path: '',
                data: {
                    headerTitle: 'My Address'
                },
                component: AddressSettingsComponent,
            }
        ],
    }
]; 
