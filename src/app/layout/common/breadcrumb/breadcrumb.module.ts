import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BreadcrumbComponent } from 'app/layout/common/breadcrumb/breadcrumb.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
        SharedModule
    ],
    exports     : [
        BreadcrumbComponent
    ]
})
export class BreadcrumbModule
{
}
