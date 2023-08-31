import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { StatementRoutingModule } from './statement-change.routing.module';

import { StatementMenuPageComponent } from './statement-menu-page.component';
import { StatementEditPageComponent } from './statement-edit-page.component';
import { ConfirmStatementPageComponent } from './confirm/confirm-statement-page.component';

// ---------------- API Start ---------------- //


import { FF000103ApiService } from '@api/ff/ff000103/ff000103-api.service';
import { FF000104ApiService } from '@api/ff/ff000104/ff000104-api.service';
import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';
import { FJ000101ApiService } from '@api/fj/fj000101/fj000101-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        UserMaskModule, //遮罩
        UserSetCertifyModule,
        UserSetResultModule,
        StatementRoutingModule,
        SelectSecurityModule,
        CheckSecurityModule

    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FJ000101ApiService,
        FF000103ApiService,
        FF000104ApiService

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //


        StatementMenuPageComponent,
        StatementEditPageComponent,
        ConfirmStatementPageComponent
    ],
    exports: [
    ]
})
export class StatementModule { }