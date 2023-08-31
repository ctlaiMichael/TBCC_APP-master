import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { NgModule } from '@angular/core';
import { EmailChangeRoutingModule } from './email-change.routing.module';
import { SharedModule } from '@shared/shared.module';



import { EmailChgPageComponent } from './email-change-page.component';
import { ConfirmMailPageComponent } from './confirm/confirm-email-page.component';


// ---------------- API Start ---------------- //


import { FF000103ApiService } from '@api/ff/ff000103/ff000103-api.service';
import { FF000104ApiService } from '@api/ff/ff000104/ff000104-api.service';
import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        UserMaskModule, //遮罩
        EmailChangeRoutingModule,
        UserSetCertifyModule,
        UserSetResultModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FF000103ApiService
        , FF000104ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //

        EmailChgPageComponent
        , ConfirmMailPageComponent
    ],
    exports: [
    ]
})
export class EmailChangeModule { }