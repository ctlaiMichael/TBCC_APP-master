import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HinetFeeRoutingModule } from './hinet-fee-routing.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

import { SearchBankModule } from '@shared/template/bank/search-bank.module';
import { AmountFormateModule } from '@shared/formate/number/amount/amount-formate.module';
// ---------------- Pages Start ---------------- //
import { HinetFeePageComponent } from './hinet-fee-page.component';
import { HinetFeeConfirmPageComponent } from './hinet-fee-confirm-page.component';
import { HinetFeeResultPageComponent } from './hinet-fee-result-page.component';

// ---------------- API Start ---------------- //
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { F7000401ApiService } from '@api/f7/f7000401/f7000401-api.service';
import { F7000402ApiService } from '@api/f7/f7000402/f7000402-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    HinetFeeRoutingModule,
    AmountFormateModule,          // 金額檢核
    SearchBankModule,             // 銀行代碼查詢(共用)
    SelectSecurityModule,         // 安控機制
    CheckSecurityModule,          // 安控機制
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F7000104ApiService,
    F7000401ApiService,
    F7000402ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    HinetFeePageComponent,
    HinetFeeConfirmPageComponent,
    HinetFeeResultPageComponent
  ]
})
export class HinetFeeModule { }
