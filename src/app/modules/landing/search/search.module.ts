import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { LandingSearchComponent } from 'app/modules/landing/search/search.component';
import { landingSearchRoutes } from 'app/modules/landing/search/search.routing';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { _SwiperBannerModule } from 'app/layout/common/_swiper-banner/swiper-banner.module';
import { _SearchModule } from 'app/layout/common/_search/search.module';
import { _FeaturedStoresModule } from 'app/layout/common/_featured-stores/featured-stores.module';
import { _FeaturedProductsModule } from 'app/layout/common/_featured-products/featured-products.module';
import { _AdsBannerModule } from 'app/layout/common/_ads-banner/ads-banner.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginationModule } from 'app/layout/common/pagination/pagination.module';
import { ErrorBackgroundModule } from 'app/shared/error-background/error-background.module';

@NgModule({
    declarations: [
        LandingSearchComponent
    ],
    imports     : [
        RouterModule.forChild(landingSearchRoutes),
        MatButtonModule,
        MatIconModule,
        SharedModule,
        MatInputModule,
        FuseCardModule,
        _SearchModule,
        _FeaturedStoresModule,
        _FeaturedProductsModule,
        _AdsBannerModule,
        _SwiperBannerModule,
        MatPaginatorModule,
        PaginationModule,
        ErrorBackgroundModule
    ]
})
export class LandingSearchModule
{
}
