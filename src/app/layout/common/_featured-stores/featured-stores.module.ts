import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { _FeaturedStoresComponent } from 'app/layout/common/_featured-stores/featured-stores.component';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        _FeaturedStoresComponent
    ],
    imports     : [
        RouterModule.forChild([]),
        SharedModule,
        MatIconModule
    ],
    providers: [
        // CurrencyPipe,
        DatePipe
    ],
    exports     : [
        _FeaturedStoresComponent
    ]
})
export class _FeaturedStoresModule
{
}
