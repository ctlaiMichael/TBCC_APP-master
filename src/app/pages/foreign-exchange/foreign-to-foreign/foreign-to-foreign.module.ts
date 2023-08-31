import { NgModule } from '@angular/core';
import { ForeignToForeignRoutingModule } from './foreign-to-foreign-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ExchangeModule } from '@pages/financial/exchange/exchange.module';
// ---------------- 安控 Start ---------------- //
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
// import { ProportyType } from './propertyType/proportyType-page.component';
import { ForeignToForeignEditComponent } from './edit/foreign-to-foreign-edit.component';
import { ForeignToForeignConfirmComponent } from './confirm/foreign-to-foreign-confirm.component';
import { ForeignToForeignResultComponent } from './result/foreign-to-foreign-result.component';
import { ForeignToForeignMainComponent } from './foreign-to-foreign-main/foreign-to-foreign-mainpage.component';



// ---------------- API Start ---------------- //

import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';

import { F5000104ApiService } from '@api/f5/f5000104/f5000104-api.service';
import { ExchangePageModule } from '@pages/financial/exchange/exchange-page.module';
import { RateFormateModule } from '@shared/formate/number/rate/rate-formate.module';
import { FlagFormateModule } from '@shared/formate/view/flag/flag-formate.module';
import { InfomationModule } from '@shared/popup/infomation/infomation.module';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000106ApiService } from '@api/f5/f5000106/f5000106-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service';
import { CurrencyFlagPopupModule } from '@shared/popup/currency-flag/currency-flag-popup.module';
import { TwdToForeignServiceModule } from '../shared/service/twd-to-foreign.service.module';
import { TwdToForeignService } from '../shared/service/twd-to-foreign.service';

// ---------------- Service Start ---------------- //

// ---------------- Page Start ---------------- //

@NgModule({
    imports: [
        SharedModule
        , ForeignToForeignRoutingModule
        , InfomationModule
        , ExchangeModule
        , SelectSecurityModule         // 安控機制
        , CheckSecurityModule         // 安控機制
        , ExchangePageModule
        , RateFormateModule
        , FlagFormateModule
        , CurrencyFlagPopupModule
        , TwdToForeignServiceModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        F5000101ApiService,
        F5000102ApiService,
        F5000103ApiService,
        F5000104ApiService,
        F5000105ApiService,
        F5000106ApiService,
        F2000201ApiService,
        F5000101ApiService,
        F5000103ApiService,
        F5000105ApiService,
        F5000102ApiService,
        TwdToForeignService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        ForeignToForeignEditComponent
        , ForeignToForeignConfirmComponent
        , ForeignToForeignResultComponent
        , ForeignToForeignMainComponent
    ],

})
export class ForeignToForeignModule { }
