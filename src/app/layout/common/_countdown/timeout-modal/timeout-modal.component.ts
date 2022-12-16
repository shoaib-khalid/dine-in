import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StoresService } from 'app/core/store/store.service';
import { Store } from 'app/core/store/store.types';
import { CustomerVoucher, VoucherVerticalList } from 'app/core/_voucher/voucher.types';

@Component({
  selector: 'timeout-modal',
  templateUrl: './timeout-modal.component.html',
})
export class TimeoutModalComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<TimeoutModalComponent>,
        private _storesService: StoresService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {}

    ngOnInit(): void {

    }

    okButton() {
        this.dialogRef.close();
    }

    
}