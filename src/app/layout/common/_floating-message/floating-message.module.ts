import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'app/shared/shared.module';
import { FloatingMessageSmallComponent } from './floating-message-small/floating-message-small.component';
import { FloatingMessageBigComponent } from './floating-message-big/floating-message-big.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
    declarations: [
        FloatingMessageSmallComponent,
        FloatingMessageBigComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        SharedModule,
        OverlayModule,
        PortalModule,

    ],
    exports     : [
        FloatingMessageSmallComponent,
        FloatingMessageBigComponent
    ]
})
export class FloatingMessageModule
{
}
