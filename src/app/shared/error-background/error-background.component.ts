import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'error-background',
    templateUrl    : './error-background.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ErrorBackgroundComponent 
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
