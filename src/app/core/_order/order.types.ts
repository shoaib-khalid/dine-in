import { Store } from "app/core/store/store.types";
import { Voucher } from "app/core/_voucher/voucher.types";


export interface OrderGroup
{
    id                      : string;
    subTotal                : number;
    deliveryCharges         : number;
    serviceCharges          : number;
    total                   : number;
    customerId              : string;
    appliedDiscount         : number;
    deliveryDiscount        : number;
    created                 : string;
    updated                 : string;
    platformVoucherDiscount : number;
    platformVoucherId       : string;
    paymentStatus           : string;
    paidAmount              : number;
    refundAmount            : number;
    customer                : Customer;
    orderList               : Order[];
    shipmentPhoneNumber     : string;
    shipmentEmail           : string;
    shipmentName            : string;
    regionCountryId         : string;
}

export interface OrderPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface Customer 
{
    id              : string;
    name            : string;
    phoneNumber     : string;
    email           : string;
    created         : string;
    updated         : string;
    isActivated     : boolean;
    countryId       : string;
    regionCountry: {
        id              : string;
        name            : string;
        region          : string;
        currency        : string;
        currencyCode    : string;
        currencySymbol  : string;
        timezone        : string;
    }
}

export interface Order 
{
    id                          : string;
    storeId                     : string;
    subTotal                    : number;
    deliveryCharges             : number;
    total                       : number;
    completionStatus            : string;
    paymentStatus               : string;
    customerNotes               : string;
    privateAdminNotes           : string;
    cartId                      : string;
    customerId                  : string;
    created                     : string;
    updated                     : string;
    invoiceId                   : string;
    totalReminderSent           : string;
    klCommission                : number;
    storeServiceCharges         : number;
    storeShare                  : number;
    paymentType                 : string;
    deliveryType                : string;
    appliedDiscount             : number;
    deliveryDiscount            : number;
    voucherDiscount             : null,
    storeVoucherDiscount        : null,
    appliedDiscountDescription  : null,
    deliveryDiscountDescription : null,
    beingProcess                : false,
    discountId                  : string;
    discountCalculationType     : null,
    discountCalculationValue    : null,
    discountMaxAmount           : null,
    deliveryDiscountMaxAmount   : null,
    isRevised                   : null,
    voucherId                   : string;
    storeVoucherId              : string;
    orderGroupId                : string;
    totalDataObject             : null,
    orderShipmentDetail         : OrderShipmentDetail;
    orderPaymentDetail          : OrderPaymentDetail;
    orderItemWithDetails        : OrderItemWithDetails[];
    store                       : Store;
    customer                    : Customer,
    orderRefund                 : []
}

export interface OrderShipmentDetail
{
    receiverName            : string;
    phoneNumber             : string;
    address                 : string;
    city                    : string;
    zipcode                 : number;
    email                   : string;
    deliveryProviderId      : number;
    state                   : string;
    country                 : string;
    trackingUrl             : string;
    orderId                 : string;
    storePickup             : false,
    merchantTrackingUrl     : string;
    customerTrackingUrl     : string;
    trackingNumber          : string;
    deliveryType            : string;
    vehicleType             : string;
    fulfilmentType          : string;
    deliveryServiceProvider : {
        id                  : string;
        name                : string;
    },
    deliveryPeriodDetails   : string;
}

export interface OrderPaymentDetail
{
    accountName             : string;
    gatewayId               : string;
    couponId                : string;
    time                    : string;
    orderId                 : string;
    deliveryQuotationReferenceId : number;
    deliveryQuotationAmount : number;
}

export interface OrderDetails
{
    id                          : string;
    storeId                     : string;
    subTotal                    : number;
    deliveryCharges             : number;
    total                       : number;
    completionStatus            : string;
    paymentStatus               : string;
    customerNotes               : string;
    privateAdminNotes           : string;
    cartId                      : string;
    customerId                  : string;
    created                     : string;
    updated                     : string;
    invoiceId                   : string;
    totalReminderSent           : string;
    klCommission                : string;
    storeServiceCharges         : string;
    storeShare                  : string;
    paymentType                 : string;
    deliveryType                : string;
    appliedDiscount             : string;
    deliveryDiscount            : string;
    appliedDiscountDescription  : string;
    deliveryDiscountDescription : string;
    beingProcess                : string;
    discountId                  : string;
    discountCalculationType     : string;
    discountCalculationValue    : string;
    discountMaxAmount           : string;
    deliveryDiscountMaxAmount   : string;
    isRevised                   : string;
    orderShipmentDetail         : OrderShipmentDetail;
    orderPaymentDetail          : OrderPaymentDetail;
    store                       : Store;
    customer                    : Customer;
    orderRefund                 : String;
    orderItemWithDetails        : OrderItemWithDetails[];
    voucherDetail               : Voucher
}

export interface Customer 
{
    id          : string;
    name        : string;
    phoneNumber : string;
    email       : string;
    created     : string;
    updated     : string;
}

export interface OrderItemWithDetails
{
    id                      : string;
    orderId                 : string;
    productId               : string;
    price                   : number;
    productPrice            : number;
    weight                  : string;
    quantity                : number;
    itemCode                : string;
    productName             : string;
    specialInstruction      : string;
    productVariant          : string;
    discountId              : string;
    normalPrice             : string;
    discountLabel           : string;
    status                  : string;
    originalQuantity        : string;
    discountCalculationType : string;
    discountCalculationValue: string;
    orderSubItem            : string;
    SKU                     : string;
    itemAssetDetails: [
        {
        id        : string;
        itemCode  : string;
        name      : string;
        url       : string;
        productId : string;
        }
    ];
    productInventory:
    {
        compareAtprice: number
        itemCode: string;
        price: number
        product:
        {
            allowOutOfStockPurchases: boolean;
            categoryId: string;
            description: string;
            id: string;
            isPackage: boolean;
            minQuantityForAlarm: number;
            name: string;
            region: string;
            seoUrl: string;
            status: string;
            storeId: string;
            thumbnailUrl: string;
            trackQuantity: boolean;
            vehicleType: string;
            vendor: string;

        }
        productInventoryItems: []
        quantity: number;
        sku: string;
    }
}

export interface OrderItem
{
    id: string;
    orderId: string;
    productId: string;
    price: number;
    productPrice: number;
    weight: string;
    quantity: number;
    itemCode: string;
    productName: string;
    specialInstruction: string;
    productVariant: string;
    SKU: string;
}

export interface DeliveryRiderDetails
{
    name: string;
    phoneNumber: string;
    plateNumber: string;
    trackingUrl: string;
    orderNumber: string;
    provider: {
        id : number;
        name : string;
        providerImage : string;
    }
    airwayBill: string;
}

export interface DeliveryOrderStatus
{
    deliveryCompletionStatus: string;
    description             : string;
    id                      : string;
    orderId                 : string;
    spOrderId               : string;
    status                  : string;
    systemTransactionId     : string;
    updated                 : string;
}

export interface OrderPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface OrdersCountSummary
{
    label?: string;
    completionStatus: string;
    count: number;
}
