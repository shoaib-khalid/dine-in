import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BuyerCheckoutComponent } from './checkout.component';
import { BuyerCheckoutRoutes } from './checkout.routing';
import { ModalConfirmationDeleteItemComponent } from './modal-confirmation-delete-item/modal-confirmation-delete-item.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginationModule } from 'app/layout/common/pagination/pagination.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs'
import { MatTableModule } from '@angular/material/table';
import { FuseCardModule } from '@fuse/components/card';
import { ErrorBackgroundModule } from 'app/shared/error-background/error-background.module';

@NgModule({
    declarations: [
        BuyerCheckoutComponent,
        ModalConfirmationDeleteItemComponent,
    ],
    imports     : [
        RouterModule.forChild(BuyerCheckoutRoutes),
        MatButtonModule,
        MatPaginatorModule,
        PaginationModule,
        MatIconModule,
        MatTabsModule,
        MatMenuModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDialogModule,
        MatRadioModule,
        FuseCardModule,
        MatExpansionModule,
        ErrorBackgroundModule,
        SharedModule,
    ],
    providers   : [
        DatePipe,
        CurrencyPipe
    ]
})
export class BuyerCheckoutModule
{
}
