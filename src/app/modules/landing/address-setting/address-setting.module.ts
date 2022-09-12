import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AddressSettingsComponent } from './address-setting.component';
import { addressSettingsRoutes } from './address-setting.routing'
import { _CustomerAddressesModule } from 'app/layout/common/_customer-addresses/customer-addresses.module';

@NgModule({
    declarations: [
        AddressSettingsComponent,
    ],
    imports     : [
        RouterModule.forChild(addressSettingsRoutes),
        _CustomerAddressesModule
    ],
    providers   : [
        DatePipe
    ]
})
export class AddressSettingsModule
{
}
