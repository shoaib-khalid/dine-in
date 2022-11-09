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
// import { DatePipe } from '@angular/common';
import { ErrorBackgroundModule } from 'app/shared/error-background/error-background.module';
import { OrdersHistoryComponent } from './orders-history.component';
import { ordersHistoryRoutes } from './orders-history.routing';
import { OrderHistoryDetailsComponent } from './orders-history-details/orders-history-details.component';
import { EditPhoneNumberDialog } from './modal-edit-phonenumber/modal-edit-phonenumber.component';


@NgModule({
    declarations: [
        OrdersHistoryComponent,
        OrderHistoryDetailsComponent,
        EditPhoneNumberDialog
    ],
    imports     : [
        RouterModule.forChild(ordersHistoryRoutes),
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
        ErrorBackgroundModule
    ],
    bootstrap   : [
    ],
    // providers: [
    //     DatePipe
    // ],
})
export class OrdersHistoryModule
{
}
