import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { LandingPromotionComponent } from 'app/modules/landing/promotion/promotion.component';
import { landingPromotionRoutes } from 'app/modules/landing/promotion/promotion.routing';


@NgModule({
    declarations: [
        LandingPromotionComponent
    ],
    imports     : [
        RouterModule.forChild(landingPromotionRoutes),
        SharedModule
    ]
})
export class LandingPromotionModule
{
}
