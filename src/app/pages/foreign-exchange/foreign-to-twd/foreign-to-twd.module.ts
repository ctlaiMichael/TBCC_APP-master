import { NgModule } from '@angular/core';
import { ForeignToTwdRoutingModule } from './foreign-to-twd-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ExchangeModule } from '@pages/financial/exchange/exchange.module';
// ---------------- 安控 Start ---------------- //
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// ---------------- Pages Start ---------------- //
import { ForeignToTwdEditComponent } from './edit/foreign-to-twd-edit.component';
import { ForeignToTwdConfirmComponent } from './confirm/foreign-to-twd-confirm.component';
import { ForeignToTwdResultComponent } from './result/foreign-to-twd-result.component';
import { ForeignToTwdMainComponent } from './foreign-to-twd-main/foreign-to-twd-mainpage.component';
import { ProportyType } from './propertyType/proportyType-page.component';

// ---------------- API Start ---------------- //

import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { ExchangePageModule } from '@pages/financial/exchange/exchange-page.module';
import { RateFormateModule } from '@shared/formate/number/rate/rate-formate.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { CurrencyFlagPopupModule } from '@shared/popup/currency-flag/currency-flag-popup.module';
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service';
import { F5000109ApiService } from '@api/f5/f5000109/f5000109-api.service';
import { F5000110ApiService } from '@api/f5/f5000110/f5000110-api.service';
import { F5000111ApiService } from '@api/f5/f5000111/f5000111-api.service';
import { BargainConfirmComponent } from '../shared/component/bargain/bargain-confirm.component';
import { BargainResultComponent } from '../shared/component/bargain/bargain-result-page.component';
import { BargainModule } from '@shared/template/bargain/bargain.module';
import { BargainConfirmModule } from '../shared/component/bargain/bargain_confirm.module';
import { BargainResultModule } from '../shared/component/bargain/bargain_result.module';
import { TwdToForeignService } from '../shared/service/twd-to-foreign.service';
import { TwdToForeignServiceModule } from '../shared/service/twd-to-foreign.service.module';

// ---------------- Service Start ---------------- //

// ---------------- Page Start ---------------- //

@NgModule({
    imports: [
        SharedModule
        , ForeignToTwdRoutingModule
        , ExchangeModule
        , BargainModule
        , SelectSecurityModule         // 安控機制
        , CheckSecurityModule         // 安控機制
        , ExchangePageModule
        , RateFormateModule
        , FlagFormateModule
        , CurrencyFlagPopupModule
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
        F2000201ApiService,
        F5000109ApiService,
        F5000110ApiService,
        F5000111ApiService,
        TwdToForeignService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        ForeignToTwdEditComponent
        , ForeignToTwdConfirmComponent
        , ForeignToTwdResultComponent
        , ForeignToTwdMainComponent
        , ProportyType
    ],

})
export class ForeignToTwdModule { }
