import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingScreenService
{
    private _show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for show
     */
    get show$(): Observable<boolean>
    {
        return this._show$.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the loading bar
     */
    show(): void
    {
        this._show$.next(true);
    }

    /**
     * Hide the loading bar
     */
    hide(): void
    {
        this._show$.next(false);
    }

}
