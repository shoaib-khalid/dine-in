import { DOCUMENT } from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import { AppConfig } from 'app/config/service.config';

@Injectable({
    providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

    constructor(
        private router: Router,
        @Inject(DOCUMENT) private _document: Document,
        ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        this._document.location.href = 'https://' + AppConfig.settings.marketplaceDomain;
        return true;

    }
}