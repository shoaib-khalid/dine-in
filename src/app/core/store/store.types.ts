export interface StoreCategory
{
    id?: string;
    name?: string;
    slug?: string;
    parentCategoryId?: string;
    storeId?: string;
    thumbnailUrl?: string;
}

export interface Store
{
    id: string;
    name: string;
    storeDescription?: string;
    storeLogo: string;
    slug?: string;
    domain?: string;
    email?: string;
    googleAnalyticId?: string;
    phoneNumber?: string;
    address?: string;
    postcode?: string;
    regionCountryStateId?: string;
    paymentType?: string;
    city?: string;
    verticalCode?: string;
    category?: string;
    storeTiming?: StoreTiming[];
    type?: string;
    totalSteps?: number;
    updatedAt?: number;
    progress?: {
        currentStep?: number;
        completed?: number;
    };
    regionCountry: StoreRegionCountry,
    serviceChargesPercentage?: number;
    duration?: number;
    featured?: boolean;
    completed?: number;
    currentStep?: number;
    storeAsset?: StoreAsset;
    storeAssets?: StoreAssets[];
    storeLogoUrl: string;
    displayAddress: string;
    // isSnooze: boolean;
    // snoozeEndTime: string;
    // snoozeReason: boolean;
    storeSnooze: StoreSnooze;
    storeDeliveryDetail :StoreDeliveryDetails;
}

export interface CreateStore
{
    address: string;
    city: string;
    clientId: string;
    domain: string;
    email: string;
    id?: string;
    isBranch: true;
    isSnooze: true;
    latitude: string;
    liveChatCsrGroupId?: string;
    liveChatCsrGroupName?: string;
    liveChatOrdersGroupId?: string;
    liveChatOrdersGroupName?: string;
    longitude?: string;
    name: string;
    paymentType: string;
    phoneNumber: string;
    postcode: string;
    regionCountryId: string;
    regionCountryStateId: string;
    serviceChargesPercentage: number;
    snoozeEndTime?: string;
    snoozeReason?: string;
    storeDescription: string;
    verticalCode: string;
}

export interface StoreTiming
{
    closeTime: string;
    day: string;
    isOff: boolean;
    openTime: string;
    breakStartTime: string;
    breakEndTime: string;
}

export interface StoreSnooze
{
    isSnooze: boolean;
    snoozeEndTime: string;
    snoozeReason: string;
    snoozeStartTime: string;
}

export interface StoreRegionCountry
{
    id: string;
    name: string;
    region: string;
    currency: string;
    currencyCode: string;
    currencySymbol: string;
    timezone: string;
    countryCode?: string; // need taufik to add in backend
}


export interface StoreDeliveryProvider
{
    id?: string;
    name?: string;
    address?: string;
    contactNo?: string;
    contactPerson?: string;
    getPriceClassname?: string;
    submitOrderClassName?: string;
    cancelOrderClassName?: string;
    queryOrderClassName?: string;
    spCallbackClassname?: string;
    pickupDateClassname?: string;
    pickupTimeClassname?: string;
    locationIdClassname?: string;
    providerImage?: string;
    regionCountryId: string;

    // sesat
    deliveryType?: string;
    deliverySpId?: string;
}

export interface StoreDeliveryDetails
{
    allowsStorePickup: boolean;
    itemType: string;
    maxOrderQuantityForBike: number;
    storeId: string;
    type: string;
}

export interface StoreSelfDeliveryStateCharges
{
    id?: string;
    delivery_charges: number;
    region_country_state_id: string;
    storeId?: string;
}

export interface StoreAsset
{
    bannerMobileUrl?: string;
    bannerUrl?: string;
    logoUrl?: string;
    storeId?: string;
}

export interface StoreAssets
{
    assetDescription: string;
    assetFile: string;
    assetType: string;
    assetUrl: string;
    id: string;
    storeId: string;
}

export interface StoreDiscount
{
    discountName: string;
    discountType: string;
    endDate: string;
    id: string;
    isActive: string;
    maxDiscountAmount: string;
    normalPriceItemOnly: null
    startDate: string;
    storeDiscountTierList: StoreDiscountTierList[],
    storeId: string;
}

export interface StoreDiscountTierList {
    calculationType: string;
    discountAmount: number;
    endTotalSalesAmount: number;
    id: string;
    startTotalSalesAmount: number;
    storeDiscountId: string;
}

export interface StorePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ProductPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface City
{
    city: String;
    costCenterCode: String;
    country: String;
    state: String;
    zone: String;
}