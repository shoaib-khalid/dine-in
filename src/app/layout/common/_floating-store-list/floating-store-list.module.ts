import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FloatingStoreListComponent } from 'app/layout/common/_floating-store-list/floating-store-list.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        FloatingStoreListComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        MatButtonModule
    ],
    exports     : [
        FloatingStoreListComponent
    ]
})
export class FloatingStoreListModule
{
}
