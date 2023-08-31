import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CurrentToFixedRoutingModule } from './current-to-fixed-routing.module';
import { AmountFormateModule } from '@shared/formate/number/amount/amount-formate.module';
import { SearchBankModule } from '@shared/template/bank/search-bank.module';
import { CommonAccountModule } from '@pages/user-set/common-account/common-account.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';
import { CurrentToFixedPageComponent } from './current-to-fixed-page.component';
import { CurrentToFixedConfirmPageComponent } from './current-to-fixed-confirm-page.component';
import { CurrentToFixedResultPageComponent } from './current-to-fixed-result-page.component';


// ---------------- Pages Start ---------------- //

// ---------------- API Start ---------------- //
import { F6000101ApiService } from '@api/f6/f6000101/f6000101-api.service';
import { F6000102ApiService } from '@api/f6/f6000102/f6000102-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    CurrentToFixedRoutingModule,
    AmountFormateModule,          // 轉帳金額檢核
    SearchBankModule,             // 銀行代碼查詢(共用)
    CommonAccountModule,          // 常用帳號設定(共用)
    SelectSecurityModule,         // 安控機制(編輯)
    CheckSecurityModule,          // 安控機制(確認)
    AccountMaskModule             // 帳號pipe
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F6000101ApiService,
    F6000102ApiService

  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    CurrentToFixedPageComponent,
    CurrentToFixedConfirmPageComponent,
    CurrentToFixedResultPageComponent
    // TwdTransferResultPageComponent

  ]
})
export class CurrentToFixedModule { }
