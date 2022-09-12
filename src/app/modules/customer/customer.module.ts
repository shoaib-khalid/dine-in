import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { customerRoutes } from 'app/modules/customer/customer.routing';

@NgModule({
    imports     : [
        RouterModule.forChild(customerRoutes),
    ],
    bootstrap   : [
    ]
})
export class BuyerModule
{
}
