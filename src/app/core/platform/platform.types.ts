export interface Platform
{
    id?         : string;
    name?       : string;
    logo?       : string;
    logoDark?   : string;
    logoSquare? : string;
    slug?       : string;
    url?        : string;
    country?    : string;
    favicon16?  : string;
    favicon32?  : string;
    gacode?     : string;
    currency?   : string;
}

export interface PlatformTag
{
id          : string;
property    : string;
content     : string;
name        : string;
platformId  : string;
}