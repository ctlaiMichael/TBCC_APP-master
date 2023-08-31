import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SSLChgRoutingModule } from './ssl-change.routing.module';

import { SslChgPageComponent } from './ssl-change-page.component';

// ---------------- API Start ---------------- //
import { FG000601ApiService } from '@api/fg/fg000601/fg000601-api.service';


import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        UserSetCertifyModule,
        UserSetResultModule,
        SSLChgRoutingModule


    ],
    providers: [
        // ---------------- Service Start ---------------- //

        FG000601ApiService


    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        SslChgPageComponent
    ],
    exports: [
    ]
})
export class SSLChgModule { }