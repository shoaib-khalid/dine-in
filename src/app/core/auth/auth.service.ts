import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { AppConfig } from 'app/config/service.config';
import { JwtService } from 'app/core/jwt/jwt.service';
import { LogService } from 'app/core/logging/log.service'
import { CustomerAuthenticate, ValidateOauthRequest } from './auth.types';
import { UserRole } from '../user/user.types';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    private _customerAuthenticate: BehaviorSubject<CustomerAuthenticate | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        // private _userService: UserService,
        private _apiServer: AppConfig,
        private _jwt: JwtService,
        private _logging: LogService
    )
    {        
    }

    socialOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        withCredentials : true
      
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for Customer Authenticate
     *
    */
    get customerAuthenticate$(): Observable<CustomerAuthenticate>
    {
        return this._customerAuthenticate.asObservable();
    }

    /**
     * Setter for Customer Authenticate
     *
     * @param value
     */
    set customerAuthenticate(value: CustomerAuthenticate)
    {
        // Store the value
        this._customerAuthenticate.next(value);
    }


    /**
     * Setter & getter for access token
     */
    set jwtAccessToken(token: string)
    {
        localStorage.setItem('jwtAccessToken', token);
    }

    get jwtAccessToken(): string
    {
        return localStorage.getItem('jwtAccessToken') ?? '';
    }

    /**
     * Getter for public access token
     */
    get publicToken(): string
    {
        return "Bearer accessToken";
    }

    get userService$()
    {
        return this._apiServer.settings.apiServer.userService;
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string, platformName: string, callbackUrl: string): Observable<any>
    {
        let userService = this._apiServer.settings.apiServer.userService;
        const header = {
            headers: new HttpHeaders().set("Authorization", this.publicToken),
            params: {
                domain: platformName,
                reseturl: callbackUrl
            }
        };

        return this._httpClient.get(userService + '/customers/' + email + '/password_reset', header).pipe(
            switchMap(async (response: any) => {

                this._logging.debug("Response from UserService (password_reset)",response);
                
            })
        );
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(id: string, code, body): Observable<any>
    {
        let userService = this._apiServer.settings.apiServer.userService;
        const header = {
            headers: new HttpHeaders().set("Authorization", this.publicToken)
        };

        return this._httpClient.put(userService + '/customers/' + id + '/password/' + code + '/reset' , body ,  header).pipe(
            switchMap(async (response: any) => {

                this._logging.debug("Response from UserService (password_reset_id)",response);
            })

        );
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { domain: string, username: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        let userService = this._apiServer.settings.apiServer.userService;
        const header = {
            headers: new HttpHeaders().set("Authorization", this.publicToken),
            withCredentials: true
        };
        
        return this._httpClient.post(userService + '/customers/authenticate', credentials, header)
            .pipe(
                map((response: any) => {

                    this._logging.debug("Response from UserService (/customers/authenticate)",response);

                    let jwtPayload = {
                        iat: Date.parse(response.data.session.created),
                        iss: 'Fuse',
                        exp: Date.parse(response.data.session.expiry),
                        role: response.data.role,
                        act: response.data.session.accessToken,
                        rft: response.data.session.refreshToken,
                        uid: response.data.session.ownerId
                    }

                    let token = this._jwt.generate({ alg: "HS256", typ: "JWT"}, jwtPayload, response.data.session.accessToken);

                    // Store the access token in the local storage
                    this.jwtAccessToken = token;

                    sessionStorage.setItem('jwtAccessToken', token);

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    this._customerAuthenticate.next(response.data);

                    // // Store the user on the user service
                    // this._userService.user = response.user;

                    // Return true
                    return response.data;
                }
            )
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        let userService = this._apiServer.settings.apiServer.userService;
        const header = {
            headers: new HttpHeaders().set("Authorization", this.publicToken),
            withCredentials: true
        };        
        
        return this._httpClient.post(userService + '/customers/session/refresh', this._jwt.getJwtPayload(this.jwtAccessToken).rft, header)
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {

                    this._logging.debug("Response from UserService (signInUsingToken)",response);

                    let jwtPayload = {
                        iat: Date.parse(response.data.session.created),
                        iss: 'Fuse',
                        exp: Date.parse(response.data.session.expiry),
                        role: response.data.role,
                        act: response.data.session.accessToken,
                        rft: response.data.session.refreshToken,
                        uid: response.data.session.ownerId
                    }
                    
                    // this._genJwt.generate(jwtheader,jwtpayload,secret)
                    let token = this._jwt.generate({ alg: "HS256", typ: "JWT"},jwtPayload,response.data.session.accessToken);

                    // Store the access token in the local storage
                    this.jwtAccessToken = token;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    this._customerAuthenticate.next(response.data);

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('jwtAccessToken');
        localStorage.removeItem('storeId');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; username: string;countryId: string;domain:string }): Observable<any>
    {
        let userService = this._apiServer.settings.apiServer.userService;
        const header: any = {
            headers: new HttpHeaders().set("Authorization", `Bearer accessToken`)
        };
        const body = {
            "deactivated": true,
            "email": user.email,
            "locked": true,
            "name": user.name,
            "username": user.username,
            "password": user.password,
            "roleId": UserRole.Customer,
            "countryId":user.countryId,
            "domain":user.domain
          };
        
        return this._httpClient.post(userService + '/customers/register', body, header).pipe(
            map((response, error) => {
                this._logging.debug("Response from AuthService (signUp)",response);

                return response;
            },
            catchError((error:HttpErrorResponse)=>{
                return of(error);
            })
            )
        );
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.jwtAccessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.jwtAccessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    /**
     * Sign in with google, fb,apple
     */

    loginOauth(authRequest:ValidateOauthRequest, origin: string):Observable<any> {  
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('Apple User is already logged in.');
        }
    
        return this._httpClient.post<any>(this.userService$ +'/customers/loginoauth', authRequest, this.socialOptions).pipe(
            switchMap(async (response: any) => {
    
                this._logging.debug("Response from AuthService (loginOauth) " + origin,response);

                // Generate jwt manually since Kalsym User Service does not have JWT
                let jwtPayload = {
                    iat: Date.parse(response.data.session.created),
                    iss: 'Fuse',
                    exp: Date.parse(response.data.session.expiry),
                    role: response.data.role,
                    act: response.data.session.accessToken,
                    rft: response.data.session.refreshToken,
                    uid: response.data.session.ownerId
                }

                // this._genJwt.generate(jwtheader,jwtpayload,secret)
                let token = this._jwt.generate({ alg: "HS256", typ: "JWT"},jwtPayload,response.data.session.accessToken);

                // Store the access token in the local storage
                this.jwtAccessToken = token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store Authentication
                this._customerAuthenticate.next(response.data);

                // Return true
                return response.data;
    
            })
        );            
    }
}
