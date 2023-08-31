import { CheckSecurityModule } from './../../../shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';


import { AgreedAccountPageComponent } from './agreed-account-page.component';
import { ConfirmAccRemovePageComponent } from './confirm-account-remove-page.component';
import { ConfirmAccAddPageComponent } from './add/confirm-account-add-page.component';
import { AddAgreedAcntPageComponent } from './add/add-agreed-acnt-page.component';


// ---------------- API Start ---------------- //


import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { FG000401ApiService } from '@api/fg/fg000401/fg000401-api.service';
import { FG000402ApiService } from '@api/fg/fg000402/fg000402-api.service';
import { FG000405ApiService } from '@api/fg/fg000405/fg000405-api.service';
import { FG000406ApiService } from '@api/fg/fg000406/fg000406-api.service';
import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';
import { AgreedAccountRoutingModule } from './agreed-account.routing.module';
import { SearchBankModule } from '@shared/template/bank/search-bank.module';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        AgreedAccountRoutingModule,
        UserSetCertifyModule,
        UserSetResultModule,
        SearchBankModule,
        SelectSecurityModule,
        CheckSecurityModule,
        UserMaskModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
      F4000103ApiService
        , FG000401ApiService
        , FG000402ApiService
        , FG000405ApiService
        , FG000406ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //

        AddAgreedAcntPageComponent
        , AgreedAccountPageComponent
        , ConfirmAccRemovePageComponent
        , ConfirmAccAddPageComponent
    ],
    exports: [
    ]
})
export class AgreedAccountModule { }