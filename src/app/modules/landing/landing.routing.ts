import { Route } from '@angular/router';
import { LandingDataResolver } from './landing.resolvers';

export const landingRoutes: Route[] = [
    // Landing routes
    {
        path       : '',
        resolve: {
            landingDataResolver: LandingDataResolver
        },
        children   : [
            // {path: '', pathMatch : 'full', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
            // {path: 'promotion', data: { breadcrumb: 'Promo' }, loadChildren: () => import('app/modules/landing/promotion/promotion.module').then(m => m.LandingPromotionModule)},
            {path: 'search', data: { breadcrumb: 'Search' }, loadChildren: () => import('app/modules/landing/search/search.module').then(m => m.LandingSearchModule)},
            {path: 'category', data: { breadcrumb: 'Category' }, loadChildren: () => import('app/modules/landing/categories/categories.module').then(m => m.CategoriesModule)},
            {path: 'location', data: { breadcrumb: 'Location' }, loadChildren: () => import('app/modules/landing/locations/locations.module').then(m => m.LandingLocationsModule)},
            {path: 'store', data: { breadcrumb: 'Store' }, loadChildren: () => import('app/modules/landing/stores/stores.module').then(m => m.LandingStoresModule)},
            {path: 'product', data: { breadcrumb: 'Product' }, loadChildren: () => import('app/modules/landing/products/products.module').then(m => m.LandingProductsModule)},
            {path: 'checkout', data: { breadcrumb: 'Checkout' }, loadChildren: () => import('app/modules/landing/checkout/checkout.module').then(m => m.BuyerCheckoutModule)},
            {path: 'carts', data: { breadcrumb: 'Carts' }, loadChildren: () => import('app/modules/landing/carts/carts.module').then(m => m.CartsModule)},
            {path: 'address', data: { breadcrumb: 'Address' }, loadChildren: () => import('app/modules/landing/address-setting/address-setting.module').then(m => m.AddressSettingsModule)},
            {path: 'thankyou', data: { breadcrumb: 'Thankyou' }, loadChildren: () => import('app/modules/landing/thankyou/thankyou.module').then(m => m.LandingThankyouModule)},
            // {path: 'legal', loadChildren: () => import('app/modules/admin/docs/legal/legal.module').then(m => m.LegalModule)},
            {path: 'getting-started', data: { breadcrumb: 'Getting Started' }, loadChildren: () => import('app/modules/landing/getting-started/getting-started.module').then(m => m.LandingGettingStartedModule)},
            {path: 'restaurant', data: { breadcrumb: 'Restaurants' }, loadChildren: () => import('app/modules/landing/restaurants/restaurants.module').then(m => m.LandingRestaurantsModule)},
            {path: 'order-history', data: { breadcrumb: 'Order History' }, loadChildren: () => import('app/modules/landing/orders-history/orders-history.module').then(m => m.OrdersHistoryModule)}
        ]
    },

    // Store Front Redirect
    {
        path: 'payment-redirect',
        data: { 
            breadcrumb: 'Payment Redirect' 
        }, 
        loadChildren: () => import('app/modules/landing/payment-redirect/payment-redirect.module').then(m => m.LandingPaymentRedirectModule)
    },
]; 