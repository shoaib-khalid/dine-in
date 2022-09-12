import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationComponent } from 'app/layout/common/pagination/pagination.component';
import { JwPaginationModule } from 'jw-angular-pagination'
import { SharedModule } from 'app/shared/shared.module';
// import { JwPaginationModule } from 'jw-angular-pagination';

@NgModule({
    declarations: [
        PaginationComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        // JwPaginationModule,
        SharedModule
    ],
    exports     : [
        PaginationComponent
    ]
})
export class PaginationModule
{
}
