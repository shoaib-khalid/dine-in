import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { landingProductsRoutes } from './products.routing';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationModule } from 'app/layout/common/pagination/pagination.module';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { _SearchModule } from 'app/layout/common/_search/search.module';
import { _FeaturedStoresModule } from 'app/layout/common/_featured-stores/featured-stores.module';
import { LandingProductsComponent } from './product-list/product-list.component';
import { _FeaturedProductsModule } from 'app/layout/common/_featured-products/featured-products.module';

@NgModule({
    declarations: [
        LandingProductsComponent,
    ],
    imports     : [
        RouterModule.forChild(landingProductsRoutes),
        MatButtonModule,
        MatIconModule,
        SharedModule,
        MatInputModule,
        MatSelectModule,
        FuseCardModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatMenuModule,
        PaginationModule,
        NgxGalleryModule,
        _SearchModule,
        _FeaturedProductsModule,
        FontAwesomeModule
    ],
    exports     : [
        FontAwesomeModule,
        NgxGalleryModule
    ]
})
export class LandingProductsModule
{
}
