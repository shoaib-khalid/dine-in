import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { PlatformSetupResolver, BrowserCompatibilityResolver } from 'app/app.resolvers';
import { UserRole } from 'app/core/user/user.roles';
import { CartsResolver } from './modules/landing/carts/carts.resolver';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Landing routes
    {
        path       : '',
        component  : LayoutComponent,
        data: {
            layout: 'fnb2',
        },
        resolve    : {
            browserCompatibility    : BrowserCompatibilityResolver,
            platformSetup           : PlatformSetupResolver,
            carts                   : CartsResolver
        },
        children   : [
            { path: '', loadChildren: () => import('app/modules/landing/landing.module').then(m => m.LandingModule) },
        ]
    },
    
    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        resolve    : {
            browserCompatibility    : BrowserCompatibilityResolver,
            platformSetup           : PlatformSetupResolver
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
            { path: 'applelogin', loadChildren: () => import('app/modules/auth/apple-login/apple-login.module').then(m => m.AppleLoginModule) }

        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve    : {
            browserCompatibility    : BrowserCompatibilityResolver,
            platformSetup           : PlatformSetupResolver
        },
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Buyer routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        data: {
            layout: 'fnb2',
            roles: [UserRole.Admin, UserRole.Customer]
        },
        resolve    : {
            browserCompatibility    : BrowserCompatibilityResolver,
            platformSetup           : PlatformSetupResolver
        },
        children   : [
            { path: '', loadChildren: () => import('app/modules/customer/customer.module').then(m => m.BuyerModule) },
        ]
    }, 

    // Admin routes
    // {
    //     path       : '',
    //     canActivate: [AuthGuard],
    //     canActivateChild: [AuthGuard], 
    //     component  : LayoutComponent,
    //     resolve    : {
    //         initialData: InitialDataResolver,
    //     },
    //     children   : [
    //         { path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule) },
    //         // {path: 'buyer', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule) },
    //     ]
    // },

    // Documentation
    {
        path: 'docs',
        children: [
            // Changelog
            // {path: 'changelog', loadChildren: () => import('app/modules/admin/docs/changelog/changelog.module').then(m => m.ChangelogModule)},
        ]
    },

    // About Symplified
    {
        path: 'about',
        resolve:  {
            browserCompatibility    : BrowserCompatibilityResolver,
            platformSetup           : PlatformSetupResolver  
        },
        children: [
            {path: 'legal', loadChildren: () => import('app/modules/landing/about/legal/legal.module').then(m => m.LegalModule)},
            {path: 'merchant', loadChildren: () => import('app/modules/landing/about/join-as-merchant/join-as-merchant.module').then(m => m.JoinAsMerchantModule)}
        ]
    },

    {
        path: '**', redirectTo: ''
    }

    // Error
    // {path: 'error', children: [
    //     {path: '404', loadChildren: () => import('app/shared/error/error-404/error-404.module').then(m => m.Error404Module)},
    //     {path: '500', loadChildren: () => import('app/shared/error/error-500/error-500.module').then(m => m.Error500Module)}
    // ]},
    // Coming Soon
    // {path: 'coming-soon', loadChildren: () => import('app/shared/coming-soon/coming-soon.module').then(m => m.ComingSoonModule)},


];
