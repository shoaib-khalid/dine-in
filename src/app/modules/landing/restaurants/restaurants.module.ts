import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { landingStoresRoutes } from './restaurants.routing';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationModule } from 'app/layout/common/pagination/pagination.module';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { _SearchModule } from 'app/layout/common/_search/search.module';
import { LandingRestaurantsComponent } from './restaurant-list/restaurant-list.component';
import { _FeaturedStoresModule } from 'app/layout/common/_featured-stores/featured-stores.module';
import { _StoreProductsModule } from 'app/layout/common/_store-products/store-products.module';
import { _StoreCategoriesModule } from 'app/layout/common/_store-categories/store-categories.module';
import { ErrorBackgroundModule } from 'app/shared/error-background/error-background.module';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { _BottomPopUpModule } from 'app/layout/common/_bottom-popup/bottom-popup.module';

@NgModule({
    declarations: [
        LandingRestaurantsComponent
    ],
    imports     : [
        RouterModule.forChild(landingStoresRoutes),
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatMenuModule,
        SharedModule,
        FuseCardModule,
        PaginationModule,
        FontAwesomeModule,
        ErrorBackgroundModule,
        _SearchModule,
        _FeaturedStoresModule,
        _StoreProductsModule,
        _StoreCategoriesModule,
        NgxGalleryModule,
        MatTabsModule,
        FuseScrollbarModule,
        _BottomPopUpModule
    ],
    providers: [
        // CurrencyPipe,
        DatePipe
    ],
    exports     : [
        FontAwesomeModule,
        NgxGalleryModule
    ]
})
export class LandingRestaurantsModule
{
}
