import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { _AdsBannerComponent } from 'app/layout/common/_ads-banner/ads-banner.component';

@NgModule({
    declarations: [
        _AdsBannerComponent
    ],
    imports     : [
        RouterModule.forChild([]),
        SharedModule
    ],
    exports     : [
        _AdsBannerComponent
    ]
})
export class _AdsBannerModule
{
}
