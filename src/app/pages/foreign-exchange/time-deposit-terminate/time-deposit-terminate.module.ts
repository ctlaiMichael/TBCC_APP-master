import { NgModule } from '@angular/core';
import { TimeDepositTerminateRoutingModule } from './time-deposit-terminate-routing.module';

import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
import { TimeDepositTerminateComponent } from './time-deposit-terminate-page.component';
import { TimeDepositTerminateConfirmComponent } from './time-deposit-terminate-confirm-page.component';
import { TimeDepositTerminateResultComponent } from './time-deposit-terminate-result-page.component';



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //
import { ForeignDepositService } from '@pages/foreign-exchange/shared/service/foreign-deposit.service';
import { F6000401ApiService } from '@api/f6/f6000401/f6000401-api.service';
import { F6000402ApiService } from '@api/f6/f6000402/f6000402-api.service';
import { F6000403ApiService } from '@api/f6/f6000403/f6000403-api.service';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { F5000109ApiService } from '@api/f5/f5000109/f5000109-api.service';
import { TwdToForeignServiceModule } from '../shared/service/twd-to-foreign.service.module';
import { F5000110ApiService } from '@api/f5/f5000110/f5000110-api.service';
import { TwdToForeignService } from '../shared/service/twd-to-foreign.service';





@NgModule({
    imports: [
        SharedModule
        , TimeDepositTerminateRoutingModule
        , SelectSecurityModule
        , CheckSecurityModule
        , TwdToForeignServiceModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        ForeignDepositService,
        F6000401ApiService,
        F6000402ApiService,
        F6000403ApiService,
        F5000101ApiService,
        F5000101ApiService,
        F5000102ApiService,
        F5000103ApiService,
        F5000105ApiService,
        F5000109ApiService,
        F5000110ApiService,
        TwdToForeignService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        TimeDepositTerminateComponent
        , TimeDepositTerminateConfirmComponent
        , TimeDepositTerminateResultComponent
    ],

})
export class TimeDepositTerminateModule { }
