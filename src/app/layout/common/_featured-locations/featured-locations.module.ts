import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { _FeaturedLocationsComponent } from 'app/layout/common/_featured-locations/featured-locations.component';

@NgModule({
    declarations: [
        _FeaturedLocationsComponent
    ],
    imports     : [
        RouterModule.forChild([]),
        SharedModule
    ],
    exports     : [
        _FeaturedLocationsComponent
    ]
})
export class _FeaturedLocationsModule
{
}
