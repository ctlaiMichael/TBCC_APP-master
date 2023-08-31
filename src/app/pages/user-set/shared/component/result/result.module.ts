import { NgModule } from '@angular/core';
import { UserSetResultRoutingModule } from './result.routing.module';
import { SharedModule } from '@shared/shared.module';



// ---------------- API Start ---------------- //

import { ResultComponent } from './result.component';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        UserSetResultRoutingModule

    ],
    providers: [
        // ---------------- Service Start ---------------- //


    ],
    declarations: [
        // ---------------- Pages Start ---------------- //


       ResultComponent
    ],
    exports: [
        ResultComponent
    ]
})
export class UserSetResultModule { }