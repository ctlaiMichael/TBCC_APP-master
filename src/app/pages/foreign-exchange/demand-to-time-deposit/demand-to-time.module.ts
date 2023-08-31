import { NgModule } from '@angular/core';
import { DemandToTimeRoutingModule } from './demand-to-time-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Pages Start ---------------- //
import { DemandToTimePageComponent } from './demand-to-time-page.component';



// ---------------- API Start ---------------- //
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
// ---------------- Service Start ---------------- //
import { ForeignDepositService } from '@pages/foreign-exchange/shared/service/foreign-deposit.service';
import { DemandToTimePageConfirmComponent } from './demand-to-time-confirm-page.component';
import { DemandToTimeResultPageComponent } from './demand-to-time-result-page.component';
import { DepositInquiryServiceModule } from '@pages/deposit/shared/deposit-inquiry-service.module'; // 存款查詢
import { TwdToForeignService } from '../shared/service/twd-to-foreign.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { InfomationModule } from '@shared/popup/infomation/infomation.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { F6000302ApiService } from '@api/f6/f6000302/f6000302-api.service';
import { F6000301ApiService } from '@api/f6/f6000301/f6000301-api.service';
import { ForeignSavePageModule } from '@pages/financial/foreign-save/foreign-save-page.module';
import { F5000109ApiService } from '@api/f5/f5000109/f5000109-api.service';
import { F5000110ApiService } from '@api/f5/f5000110/f5000110-api.service';
import { F5000111ApiService } from '@api/f5/f5000111/f5000111-api.service';
import { TwdToForeignServiceModule } from '../shared/service/twd-to-foreign.service.module';




@NgModule({
    imports: [
        SharedModule
        , DemandToTimeRoutingModule
        , DepositInquiryServiceModule
        , InfomationModule
        , ForeignSavePageModule
        , SelectSecurityModule
        , CheckSecurityModule
        , TwdToForeignServiceModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        ForeignDepositService,
        F2000201ApiService,
        F5000101ApiService,
        F5000102ApiService,
        F5000103ApiService,
        F5000105ApiService,
        F5000109ApiService,
        F5000110ApiService,
        F5000111ApiService,
        F6000301ApiService,
        F6000302ApiService,
        TwdToForeignService

    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        DemandToTimePageComponent
        , DemandToTimePageConfirmComponent
        , DemandToTimeResultPageComponent
    ],

})
export class DemandToTimeModule { }
