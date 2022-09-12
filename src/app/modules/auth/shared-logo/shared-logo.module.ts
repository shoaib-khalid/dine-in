import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedLogoComponent } from "./shared-logo.component";


@NgModule({
    declarations: [
        SharedLogoComponent
  
    ],
    imports     : [
        CommonModule 
    ],
    exports: [
        SharedLogoComponent
    ]
})
export class SharedLogoModule
{
}
