import { Route } from '@angular/router';
import { LandingPromotionComponent } from 'app/modules/landing/promotion/promotion.component';

export const landingPromotionRoutes: Route[] = [
    {
        path     : '',  
        children   : [
            {
                path: '',
                component: LandingPromotionComponent,
            }
        ],
    },
];
