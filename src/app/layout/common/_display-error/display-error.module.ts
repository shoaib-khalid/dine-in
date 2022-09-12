import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DisplayErrorComponent } from './display-error.component';

@NgModule({
    declarations: [
        DisplayErrorComponent
    ],
    imports     : [
        RouterModule,
        CommonModule,
        BrowserModule,
        MatIconModule
    ],
    exports: [
        DisplayErrorComponent
    ]
})
export class DisplayErrorModule
{
}
