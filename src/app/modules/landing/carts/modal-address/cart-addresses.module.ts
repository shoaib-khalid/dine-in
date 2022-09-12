import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { EditCartAddressDialog } from './edit-cart-address/edit-cart-address.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CartAddressComponent } from './cart-addresses.component';

@NgModule({
    declarations: [
        CartAddressComponent,
        EditCartAddressDialog,
    ],
    imports     : [
        RouterModule.forChild([]),
        SharedModule,
        SwiperModule,
        MatButtonModule,
        FontAwesomeModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        SharedModule,
        MatSlideToggleModule,
        NgxMatSelectSearchModule,
        MatDialogModule,
        SharedModule,
        NgxMatSelectSearchModule,
        FuseAlertModule,
        MatAutocompleteModule

    ],
    exports     : [
        CartAddressComponent
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class CartAddressModule
{
}
