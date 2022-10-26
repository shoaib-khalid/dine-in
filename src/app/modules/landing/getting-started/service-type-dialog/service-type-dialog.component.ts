import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DiningService } from 'app/core/_dining/dining.service';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'service-type-dialog',
  templateUrl: './service-type-dialog.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ServiceTypeDialog implements OnInit 
{

    tableNumber: string;
    displayTableNumberErr: boolean = false;
    storeTag: string;
    servingType: string;
    
    // serviceType: 'tableService' | 'selfPickup';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ServiceTypeDialog>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _diningService: DiningService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService
    )
    {
    }

    ngOnInit(): void {
        this.storeTag = this.data['storeTag'];
        this.servingType = this.data['servingType'];
    }
    
    validateTableNumber(tableNumber: string)
    {
        if (tableNumber.length === 0 || !tableNumber.trim()) {
            this.tableNumber = null;
        }
        else {
            this.tableNumber = tableNumber.trim();
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    confirmTableNumber()
    {
        if (!this.storeTag || this.storeTag === "") {
            const confirmation = this._fuseConfirmationService.open({
                "title": "Broken URL",
                "message": "This message appear if you edit/change the url of the existing QR code. Please rescan the QR code to restart food ordering process",
                "icon": {
                  "show": true,
                  "name": "heroicons_outline:exclamation",
                  "color": "warn"
                },
                "actions": {
                  "confirm": {
                    "show": true,
                    "label": "OK",
                    "color": "warn"
                  },
                  "cancel": {
                    "show": false,
                    "label": "Cancel"
                  }
                },
                "dismissible": false
            })
            confirmation.afterClosed().subscribe(()=>{
                this._router.navigate(['/']);
                this.dialogRef.close();
            });

            return;
        }

        if (this.tableNumber) {
            this._diningService.tableNumber = this.tableNumber + "";
            this._diningService.storeTag = this.storeTag;
            this.dialogRef.close({
                tableNumber : this.tableNumber 
            });
        } else {
            this.displayTableNumberErr = true;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

}
