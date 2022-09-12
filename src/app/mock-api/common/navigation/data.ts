/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'home',
    //     title: 'Home',
    //     type : 'basic',
    //     icon : 'heroicons_outline:home',
    //     link : '/'
    // },
    {
        id   : 'orders',
        title: 'My Orders',
        type : 'basic',
        icon : 'heroicons_outline:shopping-cart',
        link : '/orders'
    },
    {
        id   : 'vouchers',
        title: 'My Vouchers',
        type : 'basic',
        icon : 'heroicons_outline:ticket',
        link : '/vouchers'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example 2',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example 3',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'orders',
        title: 'My Orders',
        type : 'basic',
        icon : 'heroicons_outline:shopping-cart',
        link : '/orders'
    },
    {
        id   : 'vouchers',
        title: 'My Vouchers',
        type : 'basic',
        icon : 'heroicons_outline:ticket',
        link : '/vouchers'
    }
];
