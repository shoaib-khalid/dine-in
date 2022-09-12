import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';
import { BlockScrollStrategy, Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/shared/shared.module';
import { _SearchLocationComponent } from 'app/layout/common/_search-location/search-location.component';

@NgModule({
    declarations: [
        _SearchLocationComponent
    ],
    imports     : [
        // RouterModule.forChild([]),
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        SharedModule
    ],
    exports     : [
        _SearchLocationComponent
    ],
    providers   : [
        {
            provide   : MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
            useFactory: (overlay: Overlay) => (): RepositionScrollStrategy => overlay.scrollStrategies.reposition(),
            deps      : [Overlay]
        }
    ]
})
export class _SearchLocationModule
{
}
