import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { _CustomerAddressesComponent } from './customer-addresses.component';
import { EditAddressDialog } from './edit-address/edit-address.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    declarations: [
        _CustomerAddressesComponent,
        EditAddressDialog,
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
        _CustomerAddressesComponent
    ]
})
export class _CustomerAddressesModule
{
}
