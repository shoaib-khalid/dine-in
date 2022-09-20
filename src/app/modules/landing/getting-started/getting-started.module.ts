import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { LandingGettingStartedComponent } from 'app/modules/landing/getting-started/getting-started.component';
import { landingGettingStartedRoutes } from 'app/modules/landing/getting-started/getting-started.routing';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceTypeDialog } from './service-type-dialog/service-type-dialog.component';

@NgModule({
    declarations: [
        LandingGettingStartedComponent,
        ServiceTypeDialog
    ],
    imports     : [
        RouterModule.forChild(landingGettingStartedRoutes),
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        SharedModule
    ]
})
export class LandingGettingStartedModule
{
}
