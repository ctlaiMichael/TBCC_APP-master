import { NgModule } from '@angular/core';
import { UserSetCertifyRoutingModule } from './certify.routing.module';
import { SharedModule } from '@shared/shared.module';




// ---------------- API Start ---------------- //

import { CertifyComponent } from './certify.component';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        UserSetCertifyRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //


    ],
    declarations: [
        // ---------------- Pages Start ---------------- //

      
        CertifyComponent
    ],
    exports: [
        CertifyComponent
    ]
})
export class UserSetCertifyModule { }