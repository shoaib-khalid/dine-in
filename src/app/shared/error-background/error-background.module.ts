import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorBackgroundComponent } from './error-background.component';

@NgModule({
    declarations: [
        ErrorBackgroundComponent
    ],
    imports     : [
        CommonModule
    ],
    exports: [
        ErrorBackgroundComponent
    ]
})
export class ErrorBackgroundModule
{
}
