import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CartService } from 'app/core/cart/cart.service';

@Component({
  selector: 'modal-confirmation-delete-item',
  templateUrl: './modal-confirmation-delete-item.component.html',
})
export class ModalConfirmationDeleteItemComponent implements OnInit {

  cartId :string ='';
  itemId : string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalConfirmationDeleteItemComponent>,
    private _cartService: CartService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit(): void {
    this.cartId = this.data['cartId'];
    this.itemId = this.data['itemId'];

  }

  cancelButton() {
    this.dialogRef.close();
  }

  deleteButton() {
    this._cartService.deleteCartItem(this.cartId, this.itemId)
        .subscribe((response)=>{
          this.dialogRef.close();
        });
  }

}
