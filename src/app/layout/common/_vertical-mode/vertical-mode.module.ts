import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { _VerticalModeComponent } from 'app/layout/common/_vertical-mode/vertical-mode.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        _VerticalModeComponent
    ],
    imports     : [
        MatIconModule,
        MatButtonModule,
        SharedModule
    ],
    exports     : [
        _VerticalModeComponent
    ]
})
export class _VerticalModeModule
{
}
