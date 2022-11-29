import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'app/config/service.config';
import { UserService } from 'app/core/user/user.service';
import { interval, map, Observable, ReplaySubject, shareReplay, Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { TimeComponents } from './countdown.types';

@Injectable({
    providedIn: 'root'
})
export class CountdownService
{
    private _countdown: ReplaySubject<number> = new ReplaySubject<number>(60);
    private _countdownTimer: ReplaySubject<TimeComponents> = new ReplaySubject<TimeComponents>(1);
    countLeft: number = 60;
    interval;

    /**
    * Constructor
    */
    constructor(
        private _userService: UserService
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

    set countdownTimer(value: any)
    {
        // Store the value
        this._countdownTimer.next(value);
    }

    /**
     * Getter for countdown timer
     */
    get countdownTimer$(): Observable<TimeComponents>
    {
        return interval(1000).pipe(
                    switchMap(x => this._userService.userSessionResponse$),
                    map(resp => {
                        if (resp && resp.expiryTime) {
                            return this.calcDateDiff(resp.expiryTime)
                        }        
                        else {
                            return {
                                secondsToDday   : 0,
                                minutesToDday   : 0,
                                hoursToDday     : 0,
                                daysToDday      : 0,
                                timeDifference  : 0
                            }
                        }}),
                    // takeWhile(x => x.timeDifference > 0),
                    shareReplay(1)
                );
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    startTimer(countdown: number = null) {

        if (countdown){
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
        }, 1000)
    }
    
    pauseTimer() {
        clearInterval(this.interval);
    }

    /**
     * Calculate time difference
     * 
     * @param expiryTime 
     * @returns 
     */
    calcDateDiff(expiryTime: string): TimeComponents {
        const dDay = new Date(expiryTime).valueOf();
      
        const milliSecondsInASecond = 1000;
        const hoursInADay = 24;
        const minutesInAnHour = 60;
        const secondsInAMinute = 60;
      
        const timeDifference = dDay - Date.now();
      
        // Calculate days remaining
        const daysToDday = Math.floor(
            timeDifference /
                (milliSecondsInASecond * minutesInAnHour * secondsInAMinute * hoursInADay)
        );
      
        // Calculate hours remaining
        const hoursToDday = Math.floor(
            (timeDifference /
                (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
                hoursInADay
        );
      
        // Calculate minutes remaining
        const minutesToDday = Math.floor(
            (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
                secondsInAMinute
        );
      
        // Calculate seconds remaining
        const secondsToDday = Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;
                
        return { secondsToDday, minutesToDday, hoursToDday, daysToDday, timeDifference };
    }

}