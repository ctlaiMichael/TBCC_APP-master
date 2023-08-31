import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ForeignInsurancePayRoutingModule } from './foreign-insurance-pay-routing.module';
// ---------------- 安控 Start ---------------- //
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';

// ---------------- API Start ---------------- //
import { F5000201ApiService } from '@api/f5/f5000201/f5000201-api.service';
import { F5000202ApiService } from '@api/f5/f5000202/f5000202-api.service';

// ---------------- Page Start ---------------- //
import { ForeignInsurancePayComponent } from './foreign-insurance-pay-edit/foreign-insurance-pay.component';
import { ForeignInsurancePayConfirmComponent } from './foreign-insurance-pay-confirm/foreign-insurance-pay-confirm';
import { ForeignInsurancePayResultComponent } from './foreign-insurance-pay-result/foreign-insurance-pay-result';
import { ForeignInsurancePay } from '@conf/terms/forex/foreign-insurance-pay-notice';
import { InfomationModule } from '@shared/popup/infomation/infomation.module';

@NgModule({
    imports: [
        SharedModule,
        SelectSecurityModule, //安控機制
        CheckSecurityModule , //安控機制
        ForeignInsurancePayRoutingModule,
        InfomationModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        F5000201ApiService,
        F5000202ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        ForeignInsurancePayComponent
        ,ForeignInsurancePayConfirmComponent
        ,ForeignInsurancePayResultComponent
    ],

})
export class ForeignInsurancePayModule { }
