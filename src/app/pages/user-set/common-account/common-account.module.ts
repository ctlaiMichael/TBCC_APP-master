import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { NgModule } from '@angular/core';
import { CommonAccountRoutingModule } from './common-account.routing.module';
import { SharedModule } from '@shared/shared.module';


import { CommonAccountPageComponent } from './common-account-page.component';
import { ModifyAccountPageComponent } from './modify/modify-account-page.component';
import { ConfirmAccModifyPageComponent } from './modify/confirm-account-modify-page.component';
import { AddAccountPageComponent } from './modify/add-account-page.component';


// ---------------- API Start ---------------- //


import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { FG000401ApiService } from '@api/fg/fg000401/fg000401-api.service';
import { FG000403ApiService } from '@api/fg/fg000403/fg000403-api.service';
import { FG000404ApiService } from '@api/fg/fg000404/fg000404-api.service';
import { UserSetCertifyModule } from '../shared/component/popup/certify.module';
import { UserSetResultModule } from '../shared/component/result/result.module';
import { FG000406ApiService } from '@api/fg/fg000406/fg000406-api.service';
import { FG000402ApiService } from '@api/fg/fg000402/fg000402-api.service';
import { FG000405ApiService } from '@api/fg/fg000405/fg000405-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { SearchBankModule } from '@shared/template/bank/search-bank.module';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        CommonAccountRoutingModule,
        UserSetCertifyModule,
        UserSetResultModule,
        SearchBankModule,
        SelectSecurityModule,
        CheckSecurityModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FG000401ApiService
        , FG000402ApiService
        , FG000403ApiService
        , FG000404ApiService
        , FG000405ApiService
        , F4000103ApiService
        , FG000406ApiService
        , F4000101ApiService

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //

        CommonAccountPageComponent  //常用
        , ModifyAccountPageComponent  //常用修改
        , ConfirmAccModifyPageComponent //常用確認
        , AddAccountPageComponent     //常用增加
    ],
    exports: [
        CommonAccountPageComponent  //常用
        , ModifyAccountPageComponent  //常用修改
        , ConfirmAccModifyPageComponent //常用確認
        , AddAccountPageComponent     //常用增加
    ]
})
export class CommonAccountModule { }