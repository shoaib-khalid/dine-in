import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginationModule } from 'app/layout/common/pagination/pagination.module';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs'
import { voucherRoutes } from './vouchers.routing';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { FuseCardModule } from '@fuse/components/card';
import { VoucherModalComponent } from './voucher-modal/voucher-modal.component';

@NgModule({
    declarations: [
        VoucherListComponent,
        VoucherModalComponent
    ],
    imports     : [
        RouterModule.forChild(voucherRoutes),
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatMenuModule,
        PaginationModule,
        SharedModule,
        MatTabsModule,
        FuseCardModule
    ],
    bootstrap   : [
    ]
})
export class VouchersModule
{
}
