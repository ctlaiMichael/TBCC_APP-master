import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';


import { NetPswdChgRoutingModule } from './netpswd-change.routing.module';
import { NetPswdChgPageComponent } from './netpswd-change-page.component';



// ---------------- API Start ---------------- //


import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';
import { FG000101ApiService } from '@api/fg/fg000101/fg000101-api.service';
import { FG000201ApiService } from '@api/fg/fg000201/fg000201-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        NetPswdChgRoutingModule,
        UserSetCertifyModule,
        UserSetResultModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FG000101ApiService
        , FG000201ApiService
        , F4000101ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //

        NetPswdChgPageComponent

    ],
    exports: [
    ]
})
export class NetPswdChgModule { }