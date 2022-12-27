import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { DOCUMENT } from '@angular/common';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AddOnItemProduct, AddOnProduct, Product, ProductAssets, ProductInventory, ProductInventoryItem, ProductPackageOption } from 'app/core/product/product.types';
import { FormBuilder } from '@angular/forms';
import { ProductsService } from 'app/core/product/product.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CartService } from 'app/core/cart/cart.service';
import { AuthService } from 'app/core/auth/auth.service';
import { JwtService } from 'app/core/jwt/jwt.service';
import { Cart, CartItem, CustomerCart } from 'app/core/cart/cart.types';
import { Store } from 'app/core/store/store.types';
import { StoresService } from 'app/core/store/store.service';
import { AppConfig } from 'app/config/service.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector     : 'modal-edit-cart-item',
    templateUrl  : './modal-edit-cart-item.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class EditCartItemModalComponent implements OnInit, OnDestroy
{

    platform: Platform;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    cartItem: CartItem = null
    displayedProduct: any = {
        price: 0,
        itemCode: null,
        sku: null,
        discountAmount:0,
        discountedPrice:0,
        SubTotal:0,
        normalPrice: 0,
        basePrice: 0
    }
    openPreview: boolean = false;
    quantity: number = 1;
    minQuantity: number = 1;
    maxQuantity: number = 999;

    specialInstructionForm = this._formBuilder.group({
        specialInstructionValue     : ['']
    });
    store: Store
    addOns: AddOnProduct[] = [];
    sumAddonPrice: number = 0;

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _platformService: PlatformService,
        private _router: Router,
        // @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EditCartItemModalComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _productsService: ProductsService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _cartService: CartService,
        private _authService: AuthService,
        private _jwtService: JwtService,
        private _storesService: StoresService,
        private _apiServer: AppConfig,

    )
    {
        this.cartItem = data.product;
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        // Get special instruction value
        this.specialInstructionForm.get('specialInstructionValue').patchValue(this.cartItem.specialInstruction)
        
        this._platformService.platform$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((platform: Platform)=>{
                this.platform = platform;
            })  
            
        this._storesService.store$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((store: Store) => {
                if (store){
                    this.store = store;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    checkQuantity(operator: string = null) {
        if (operator === 'decrement')
            this.quantity > this.minQuantity ? this.quantity -- : this.quantity = this.minQuantity;
        else if (operator === 'increment')
            this.quantity < this.maxQuantity ? this.quantity ++ : this.quantity = this.maxQuantity;
        else {
            if (this.quantity < this.minQuantity) 
                this.quantity = this.minQuantity;
            else if (this.quantity > this.maxQuantity)
                this.quantity = this.maxQuantity;
        }
    }
    
    save() {
        // this._bottomSheet.dismiss();
        this.dialogRef.close({
            saved: true,
            specialInstruction: this.specialInstructionForm.get('specialInstructionValue').value
        });
    }

    closeDialog() {
        this.dialogRef.close({
            saved: false
        });
    }

}
