/**
 * Route定義
 * epay 信用卡新增/變更預設
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { CardLoginManagementRoutingModule } from './card-login-management-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
// ---------------- Pages Start ---------------- //
import { CardLoginManagementComponent } from './card-login-management.component';
import { QrcodePayTermsCardComponent } from './term/qrcode-pay-terms/qrcode-pay-terms-card.component';
import { CardLoginBindingComponent } from '@pages/epay-card/card-binding/card-login-binding.component';
// ---------------- API Start ---------------- //
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { FQ000113ApiService } from '@api/fq/fq000113/fq000113-api.service';
import { ConfirmCheckBoxModule } from '@shared/popup/confirm-checkbox/confirm-checkbox.module';
import { EmvService } from '../shared/service/emv.service';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';
import { CardSafePopUpModule } from '@shared/transaction-security/card-safe-popup/card-safe-popup.module';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //



@NgModule({
  imports: [
    SharedModule,
    CardLoginManagementRoutingModule,
    ConfirmCheckBoxModule,
    AccountMaskModule,    
    CardSafePopUpModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FQ000112ApiService
    , FQ000113ApiService
    , EmvService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    QrcodePayTermsCardComponent
    , CardLoginManagementComponent
    , CardLoginBindingComponent
  ]
})
export class CardLoginManagementModule { }
