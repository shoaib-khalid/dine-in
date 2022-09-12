import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StoresService } from 'app/core/store/store.service';
import { Store } from 'app/core/store/store.types';
import { CustomerVoucher, VoucherVerticalList } from 'app/core/_voucher/voucher.types';

@Component({
  selector: 'voucher-moal',
  templateUrl: './voucher-modal.component.html',
})
export class VoucherModalComponent implements OnInit {

    icon: string;
    title: string;
    description: string;
    voucher: CustomerVoucher;
    storeName: string;
    verticalList: string[] = [];

    constructor(
        private dialogRef: MatDialogRef<VoucherModalComponent>,
        private _storesService: StoresService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit(): void {
        this.icon = this.data['icon'];
        this.title = this.data['title'];
        this.description = this.data['description'];
        this.voucher = this.data['voucher'];
        this.storeName = this.data['storeName']

        if (this.voucher) {
            this.verticalList = this.voucher.voucher.voucherVerticalList.map(x => x.verticalCode);        
        }
    }

    okButton() {
        this.dialogRef.close();
    }

    
}