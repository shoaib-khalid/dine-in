import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { _FeaturedProductsComponent } from 'app/layout/common/_featured-products/featured-products.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        _FeaturedProductsComponent
    ],
    imports     : [
        RouterModule.forChild([]),
        SharedModule,
        MatIconModule
    ],
    exports     : [
        _FeaturedProductsComponent
    ]
})
export class _FeaturedProductsModule
{
}
