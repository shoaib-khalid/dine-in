export interface Ad
{
    bannerUrl?  : string;
    redirectUrl?: string;
}

export interface Banner 
{
    id              : number;
    bannerUrl       : string;
    regionCountryId : string;
    type?           : string;
    actionUrl       : string;
    delayDisplay    : number;
    sequence        : number;
}