import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FloatingBestSellingComponent } from './floating-best-selling.component';

@NgModule({
    declarations: [
        FloatingBestSellingComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        MatButtonModule,
        DragDropModule
    ],
    exports     : [
        FloatingBestSellingComponent
    ]
})
export class FloatingBestSellingModule
{
}
