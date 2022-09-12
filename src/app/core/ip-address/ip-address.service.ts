import { Injectable } from '@angular/core';  
import { HttpClient  } from '@angular/common/http';  
import { BehaviorSubject, Observable } from 'rxjs';
import { IPAdressInfo } from './ip-address.type';
import { map } from 'rxjs/operators';
import { LogService } from '../logging/log.service';
  
@Injectable({  
  providedIn: 'root'  
})  
export class IpAddressService  {

  private _ipAdressInfo: BehaviorSubject<IPAdressInfo | null> = new BehaviorSubject(null);
  
  constructor(
    private _httpClient: HttpClient,
    // private _apiServer: AppConfig,
    // private _jwt: JwtService,
    private _logging: LogService
  ) { 

  } 

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  
  /**
   * Getter for stores
   *
  */
  get ipAdressInfo$(): Observable<IPAdressInfo>
  {
    return this._ipAdressInfo.asObservable();
  }
     
  /**
  * Setter for stores
  *
  * @param value
  */
  set ipAdressInfo(value: IPAdressInfo)
  {
    // Store the value
    this._ipAdressInfo.next(value);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------  

  public getIPAddress(): Observable<IPAdressInfo>
  {
    return this._httpClient.get<any>("https://ifconfig.me/all.json")
      .pipe(
        map((response) => {

          this._logging.debug("Response from IpAddressService (getIPAddress)",response);
          
          this._ipAdressInfo.next(response);

          return response;
      }));  
  }
}