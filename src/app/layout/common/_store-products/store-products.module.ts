import { ImageLoaderConfig, IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppConfig } from 'app/config/service.config';
import { SharedModule } from 'app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { _BottomPopUpModule } from '../_bottom-popup/bottom-popup.module';
import { _StoreProductsComponent } from './store-products.component';

@NgModule({
    declarations: [
        _StoreProductsComponent
    ],
    imports     : [
        RouterModule.forChild([]),
        MatButtonModule,
        MatIconModule,
        _BottomPopUpModule,
        SharedModule,
        NgOptimizedImage,
        InfiniteScrollModule
    ],
    exports     : [
        _StoreProductsComponent,
    ],
    // providers: [{ 
    //     provide: IMAGE_LOADER, 
    //     useValue: (config: ImageLoaderConfig) => { 
    //       return `${AppConfig.settings.apiServer.assetsService}/product-assets/${config.src}` } 
    //     }
    //   ],
})
export class _StoreProductsModule
{
}
