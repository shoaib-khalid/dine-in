import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FuseFullscreenModule } from '@fuse/components/fullscreen';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { MessagesModule } from 'app/layout/common/messages/messages.module';
import { NotificationsModule } from 'app/layout/common/notifications/notifications.module';
import { QuickChatModule } from 'app/layout/common/quick-chat/quick-chat.module';
import { ShortcutsModule } from 'app/layout/common/shortcuts/shortcuts.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { CartModule } from 'app/layout/common/cart/cart.module';
import { SharedModule } from 'app/shared/shared.module';
import { FooterModule } from 'app/layout/common/footer/footer.module';
import { _SearchModule } from 'app/layout/common/_search/search.module';
import { Fnb01LayoutComponent } from './fnb-01.component';
import { DisplayErrorModule } from 'app/layout/common/_display-error/display-error.module';

@NgModule({
    declarations: [
        Fnb01LayoutComponent
    ],
    imports     : [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        FuseFullscreenModule,
        FuseLoadingBarModule,
        FuseNavigationModule,
        LanguagesModule,
        MessagesModule,
        NotificationsModule,
        QuickChatModule,
        ShortcutsModule,
        UserModule,
        FooterModule,
        CartModule,
        _SearchModule,
        DisplayErrorModule,
        SharedModule
    ],
    exports     : [
        Fnb01LayoutComponent
    ]
})
export class Fnb01LayoutModule
{
}
