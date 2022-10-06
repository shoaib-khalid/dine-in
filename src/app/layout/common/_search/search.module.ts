import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';
import { BlockScrollStrategy, Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/shared/shared.module';
import { _SearchComponent } from 'app/layout/common/_search/search.component';

@NgModule({
    declarations: [
        _SearchComponent
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
        _SearchComponent
    ],
    providers   : [
        {
            provide   : MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
            useFactory: (overlay: Overlay) => (): RepositionScrollStrategy => overlay.scrollStrategies.reposition(),
            deps      : [Overlay]
        }
    ]
})
export class _SearchModule
{
}
