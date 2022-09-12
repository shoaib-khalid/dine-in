import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { LandingThankyouComponent } from 'app/modules/landing/thankyou/thankyou.component';
import { landingThankyouRoutes } from 'app/modules/landing/thankyou/thankyou.routing';

@NgModule({
    declarations: [
        LandingThankyouComponent,
    ],
    imports     : [
        RouterModule.forChild(landingThankyouRoutes),
        MatIconModule,
        SharedModule
    ]
})
export class LandingThankyouModule
{
}
