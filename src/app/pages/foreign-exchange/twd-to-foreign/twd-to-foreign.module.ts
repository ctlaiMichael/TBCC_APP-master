import { NgModule } from '@angular/core';
import { TwdToForeignRoutingModule } from './twd-to-foreign-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ExchangePageModule } from '@pages/financial/exchange/exchange-page.module';
// ---------------- 安控 Start ---------------- //
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// ---------------- Pages Start ---------------- //
import { TwdToForeignEditComponent } from './edit/twd-to-foreign-edit.component';
import { TwdToForeignConfirmComponent } from './confirm/twd-to-foreign-confirm.component';
import { TwdToForeigResultComponent } from './result/twd-to-foreign-result-page.component';
import { TwdForeignMainComponent } from './twd-to-foreign-main/twd-foreign-mainpage.component';
import { ProportyType } from './propertyType/proportyType-page.component';

// ---------------- API Start ---------------- //

import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';

import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { RateFormateModule } from '@shared/formate/number/rate/rate-formate.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { CurrencyFlagPopupModule } from '@shared/popup/currency-flag/currency-flag-popup.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';
import { F2000101ApiService } from '@api/f2/f2000101/f2000101-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { F4000102ApiService } from '@api/f4/f4000102/f4000102-api.service';
import { F4000401ApiService } from '@api/f4/f4000401/f4000401-api.service';
import { F5000109ApiService } from '@api/f5/f5000109/f5000109-api.service';
import { BargainModule } from '@shared/template/bargain/bargain.module';
import { F5000110ApiService } from '@api/f5/f5000110/f5000110-api.service';
import { BargainConfirmComponent } from '../shared/component/bargain/bargain-confirm.component';
import { F5000111ApiService } from '@api/f5/f5000111/f5000111-api.service';
import { BargainResultComponent } from '../shared/component/bargain/bargain-result-page.component';
import { BargainConfirmModule } from '../shared/component/bargain/bargain_confirm.module';
import { BargainResultModule } from '../shared/component/bargain/bargain_result.module';
import { TwdToForeignServiceModule } from '../shared/service/twd-to-foreign.service.module';
import { TwdToForeignService } from '../shared/service/twd-to-foreign.service';

// ---------------- Service Start ---------------- //

// ---------------- Page Start ---------------- //



@NgModule({
    imports: [
        SharedModule
        , TwdToForeignRoutingModule
        , ExchangePageModule
        , BargainModule
        , RateFormateModule
        , FlagFormateModule
        , CurrencyFlagPopupModule
        , SelectSecurityModule         // 安控機制
        , CheckSecurityModule         // 安控機制
        , AccountMaskModule
        , BargainConfirmModule
        , BargainResultModule
        , TwdToForeignServiceModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        F5000101ApiService,
        F5000102ApiService,
        F5000103ApiService,
        F5000105ApiService,
        F5000109ApiService,
        F5000110ApiService,
        F5000111ApiService,
        F4000101ApiService,
        F4000102ApiService,
        F4000401ApiService,
        F2000101ApiService,
        TwdToForeignService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        TwdToForeignEditComponent
        , TwdToForeignConfirmComponent
        , TwdToForeigResultComponent
        , ProportyType
        , TwdForeignMainComponent
        // , BargainConfirmComponent
        // , BargainResultComponent
        // , ExchangeModule
        // , RateFormateModule
        // , FlagFormateModule
        // , CurrencyFlagPopupModule
    ],

})
export class TwdToForeignModule { }
