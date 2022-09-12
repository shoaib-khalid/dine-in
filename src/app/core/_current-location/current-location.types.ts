export interface CurrentLocation
{ 
    isAllowed   : boolean;
    location?   : { 
        lat: number;
        lng: number;
    }
}