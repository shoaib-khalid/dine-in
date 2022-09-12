import { ProductInventory } from "../product/product.types";

export interface ApiResponseModel<T>
{
    message?: string;
    data?: T;
    path : string;
    status: number;
    timestamp:string;
}

export interface StoresDetails
{
    id              : string;
    name            : string;
    city            : string;
    state           : string;
    postcode        : string;
    regionCountryId : string;
}

export interface StoresDetailPagination
{
    length      : number;
    size        : number;
    page        : number;
    lastPage    : number;
    startIndex  : number;
    endIndex    : number;
}

export interface ParentCategory 
{
    parentId            : string;
    parentName          : string;
    parentThumbnailUrl  : string;
}

export interface ChildCategory 
{
    id             : string;
    name           : string;
    thumbnailUrl   : string;
    parentCategory : ParentCategory;
    storeDetails   : StoreDetails;
}

export interface CategoryPagination
{
    length      : number;
    size        : number;
    page        : number;
    lastPage    : number;
    startIndex  : number;
    endIndex    : number;
}

export interface StoreDetails
{
    city                : string;
    distanceInMeter     : number;
    domain              : string;
    id                  : string;
    isSnooze            : boolean
    latitude            : number;
    longitude           : number;
    name                : string;
    postcode            : string;
    regionCityDetails   : RegionCityDetails;
    regionCountryId     : string;
    snoozeEndTime       : string;
    snoozeReason        : string;
    snoozeStartTime     : string;
    state               : string;
    storeAssets         : StoreAssets[];
    storeDescription    : string;
    storeSnooze         : StoreSnooze;
    storeTag            : string[];
    storeTiming         : StoreTiming[];
}

export interface RegionCityDetails 
{
    id                  : string;
    name                : string;
    regionCountryState  : RegionCountryState;
}

export interface RegionCountryState
{
    id              : string;
    name            : string;
    regionCountryId : string;
}

export interface StoreTiming
{
    closeTime       : string;
    day             : string;
    isOff           : boolean;
    openTime        : string;
    breakStartTime  : string;
    breakEndTime    : string;
}

export interface StoreSnooze
{
    isSnooze: boolean;
    snoozeEndTime: string;
    snoozeReason: string;
    snoozeStartTime: string;
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

export interface ProductDetails
{
    id              : string;
    name            : string;
    thumbnailUrl    : string;
    status          : string;
    storeDetails    : StoreDetails;
    productInventories : ProductInventory[];
}
export interface ProductDetailPagination
{
    length      : number;
    size        : number;
    page        : number;
    lastPage    : number;
    startIndex  : number;
    endIndex    : number;
}

export interface ProductOnLocationPagination
{
    length      : number;
    size        : number;
    page        : number;
    lastPage    : number;
    startIndex  : number;
    endIndex    : number;
}

export interface LandingLocation 
{
    id              : number;
    imageUrl        : string;
    cityId          : string;
    isDisplay       : boolean;
    cityDetails     : CityDetails;
    regionCountryId : string;
}

export interface LocationPagination
{
    length      : number;
    size        : number;
    page        : number;
    lastPage    : number;
    startIndex  : number;
    endIndex    : number;
}

export interface CityDetails
{
    id              : string;
    name            : string;
    regionCountryState : RegionCountryState;
}

export interface RegionCountryState
{
    id              : string;
    name            : string;
    regionCountryId : string;
    sequence        : string;
}

export interface LocationArea
{
    storeCityId         : string;
    userLocationCityId  : string;
}

export interface Tag
{
    id      : string;
    keyword : string;
}

export interface TagPagination
{
    length      : number;
    size        : number;
    page        : number;
    lastPage    : number;
    startIndex  : number;
    endIndex    : number;
}

// export interface ProductOnLocationPagination
// {
//     totalElements  : number;
//     size           : number;
//     number         : number;
//     totalPages     : number;
//     pageable       : {
//                         offset : number
//                      }
//     numberOfElements : number;
// }