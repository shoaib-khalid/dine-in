import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { landingRoutes } from './landing.routing';

@NgModule({
    imports     : [
        RouterModule.forChild(landingRoutes),
    ],
    bootstrap   : [
    ]
})
export class LandingModule
{
}