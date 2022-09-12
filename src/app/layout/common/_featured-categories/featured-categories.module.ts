import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { _FeaturedCategoriesComponent } from 'app/layout/common/_featured-categories/featured-categories.component';
import { SwiperModule } from 'swiper/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        _FeaturedCategoriesComponent
    ],
    imports     : [
        RouterModule.forChild([]),
        SharedModule,
        SwiperModule,
        FontAwesomeModule,
        MatIconModule
    ],
    exports     : [
        _FeaturedCategoriesComponent
    ]
})
export class _FeaturedCategoriesModule
{
}
