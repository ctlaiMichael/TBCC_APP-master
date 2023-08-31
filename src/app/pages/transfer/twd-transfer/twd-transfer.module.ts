import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TwdTransferRoutingModule } from './twd-transfer-routing.module';
import { AmountFormateModule } from '@shared/formate/number/amount/amount-formate.module';
import { SearchBankModule } from '@shared/template/bank/search-bank.module';
import { CommonAccountModule } from '@pages/user-set/common-account/common-account.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';

// ---------------- Pages Start ---------------- //
import { TwdTransferPageComponent } from './twd-transfer-page.component';
import { TwdTransferConfirmPageComponent } from './twd-transfer-confirm-page.component';
import { TwdTransferResultPageComponent } from './twd-transfer-result-page.component';

// ---------------- API Start ---------------- //
import { F2000101ApiService } from '@api/f2/f2000101/f2000101-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { F4000102ApiService } from '@api/f4/f4000102/f4000102-api.service';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { F4000401ApiService } from '@api/f4/f4000401/f4000401-api.service';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    TwdTransferRoutingModule,
    AmountFormateModule,          // 轉帳金額檢核
    SearchBankModule,             // 銀行代碼查詢(共用)
    CommonAccountModule,          // 常用帳號設定(共用)
    SelectSecurityModule,         // 安控機制(編輯)
    CheckSecurityModule,          // 安控機制(確認)
    AccountMaskModule,            // 帳號pipe
    UserMaskModule                // 約定帳號名稱遮碼
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F2000101ApiService,
    F4000101ApiService,
    F4000102ApiService,
    F4000103ApiService,
    F4000401ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    TwdTransferPageComponent,
    TwdTransferConfirmPageComponent,
    TwdTransferResultPageComponent
  ]
})
export class TwdTransferModule { }
