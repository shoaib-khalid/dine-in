import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'app/config/service.config';
import { map, Observable, ReplaySubject, Subscription, timer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CountdownService
{
    private _countdown: ReplaySubject<number> = new ReplaySubject<number>(60);
    countLeft: number = 60;
    interval;

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
     * Setter & getter for bottom pop up
     * @param value
     */
    set countdown(value: any)
    {
        // Store the value
        this._countdown.next(value);
    }

    get countdown$(): Observable<any>
    {
        return this._countdown.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    startTimer(countdown: number = null) {
        if(countdown){
            this.countLeft = countdown;
        }

        this.interval = setInterval(() => {
            if(this.countLeft > 0) {
                this.countLeft--;
                if(this.countLeft === 0) {
                    this.pauseTimer();
                }
            } else {
                this.pauseTimer();
            }
            this._countdown.next(this.countLeft)
        },1000)
    }
    
    pauseTimer() {
        clearInterval(this.interval);
    }

}