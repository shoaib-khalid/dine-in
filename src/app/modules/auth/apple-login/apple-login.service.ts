import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppleLoginService
{

    /**
     * Constructor
     */
    constructor(
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter for 
     */
    set sfUrl(value: string) {
        localStorage.setItem('sf-url', value);
    }

    /**
     * Getter for 
     */
    get sfUrl$(): string
    {
        return localStorage.getItem('sf-url') ?? '';
    }

    /**
     * Setter for 
     */
     set guestCartId(value: string) {
        localStorage.setItem('guestCartId', value);
    }

    /**
     * Getter for 
     */
    get guestCartId$(): string
    {
        return localStorage.getItem('guestCartId') ?? '';
    }

    /**
     * Setter for 
     */
     set storeId(value: string) {
        localStorage.setItem('storeId', value);
    }

    /**
     * Getter for 
     */
    get storeId$(): string
    {
        return localStorage.getItem('storeId') ?? '';
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

}
