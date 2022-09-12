import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { landingCategoriesRoutes } from './categories.routing';
import { LandingCategoriesComponent } from './category-list/category-list.component';
import { CategoryComponent } from './category/category.component';
import { _SearchModule } from 'app/layout/common/_search/search.module';
import { _FeaturedStoresModule } from 'app/layout/common/_featured-stores/featured-stores.module';
import { _FeaturedLocationsModule } from 'app/layout/common/_featured-locations/featured-locations.module';
import { _FeaturedProductsModule } from 'app/layout/common/_featured-products/featured-products.module';
import { PaginationModule } from 'app/layout/common/pagination/pagination.module';
import { _AdsBannerModule } from 'app/layout/common/_ads-banner/ads-banner.module';
import { ErrorBackgroundModule } from 'app/shared/error-background/error-background.module';

@NgModule({
    declarations: [
        LandingCategoriesComponent,
        CategoryComponent
    ],
    imports     : [
        RouterModule.forChild(landingCategoriesRoutes),
        MatButtonModule,
        MatIconModule,
        SharedModule,
        MatInputModule,
        _SearchModule,
        _FeaturedStoresModule,
        _FeaturedLocationsModule,
        _FeaturedProductsModule,
        _AdsBannerModule,
        PaginationModule,
        ErrorBackgroundModule,
        FuseCardModule
    ]
})
export class CategoriesModule
{
}
